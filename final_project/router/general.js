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

const getbooks = async () => {
	try{
		const getBooks = await Promise.resolve (books)
		if (getBooks) {
			return getBooks
		} else {
			return Promise.reject (new error('Books not found'))
		}
	} catch (error) {
		console.log (error)
	}
}

public_users.get('/',async (req, res)=> {
  const getbooks = await getbooks()
  res.json (getbooks)
});

const getByISBN=async(isbn)=>{
    try{
      const getISBN=await Promise.resolve(isbn);
      if(getISBN){
        return Promise.resolve(isbn)
      }
      else{
        return Promise.reject(new error("Book with the isbn not found!"));
      }
    }
    catch(error){
      console.log(error);
    }
  }
  
  public_users.get('/isbn/:isbn',async(req,res)=>{
    const isbn=req.params.isbn;
    const returnedIsbn=await getByISBN(isbn);
    res.send(books[returnedIsbn]);
  })
  
    // Get books based on author
  const getByAuthor=async(author)=>{
    try{
      
      if(author){
        const authBook=[];
        Object.values(books).map((book)=>{
        if(book.author===author){
          authBook.push(book);
        }})
        return Promise.resolve(authBook);
      }
      else{
        return Promise.reject(new error("Book with the author name not found!!!"));
      }
      
    }
    catch(error){
      console.log(error);
    }
  }
  
  
    public_users.get('/author/:author',async(req,res)=>{
      const author=req.params.author;
      const data=await getByAuthor(author);
      res.send(data);
    })
  
    // Get books based on title
  const getByTitle=async(title)=>{
    try{
      
      if(title){
        const titleBook=[];
        Object.values(books).map((book)=>{
        if(book.title===title){
          titleBook.push(book);
        }})
        return Promise.resolve(titleBook);
      }
      else{
        return Promise.reject(new error("Book with the author name not found!!!"));
      }
      
    }
    catch(error){
      console.log(error);
    }
  }
  
  
    public_users.get('/title/:title',async(req,res)=>{
      const title=req.params.title;
      const data=await getByAuthor(title);
      res.send(data);
    })

module.exports.general = public_users;
