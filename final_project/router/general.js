const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "Customer successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "Customer already exists!"});    
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const Isbn = books[isbn];
    if(Isbn) {
        res.send(Isbn);
    }
    else {
        res.status(404).json({message: "Book not in Library"});
    }
 });

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author=req.params.author;
    const values = Object.values(books);
    let filtered_books = values.filter((value) => value.author === author);
    res.send(filtered_books);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title;
    const value_title = Object.values(books);
    let Title = value_title.filter((value) => value.title === title);
    res.send(Title);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn;
    const book = books[isbn];
    if(book) {
        res.send(book.reviews);
    }
    else{
        res.json({message:"Book not in library"});
    }
});

module.exports.general = public_users;
