const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user)=>{
        return user.username === username
      });
      if(userswithsamename.length > 0){
        return true;
      } else {
        return false;
      }
}

const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
      });
      if(validusers.length > 0){
        return true;
      } else {
        return false;
      }
    }

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("Customer successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
    }});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Customer not found"});
    }
    if(authenticatedUser(username,password)) {
        let isbn = req.params.isbn;
        let book = books[isbn];
        if(book) {
            let review= req.body.reviews;
            if(review) {
                book["reviews"]= review;
            }
            books[isbn] = book;
            res.send(`Review for book with isbn info ${isbn} has been added`);
        }
        else {
            res.status(404).json({message: "There is no book with this isbn number"});
        }
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({message: "Customer not found"});
    }
    if(authenticatedUser(username,password)) {
        let isbn = req.params.isbn;
        if(isbn) {
            delete books["reviews"];
        }
        res.send(`Your review for the book with isbn info ${isbn} has been deleted`);
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
