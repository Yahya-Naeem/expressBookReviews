const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password){
    res.status(400).json({message: 'Enter username or password'});
  }
  else{
    if(users[username]){
        return res.status(400).json({ message: "Username already exists" });
    }
    //register user
    users[username] = { password };
    return res.status(201).json({ message: "User registered successfully" });
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const formattedBooks = JSON.stringify(books,null,2);
  return res.status(200).send(formattedBooks);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn
  if(books[isbn]){
    return res.status(200).json(books[isbn]);
  }else {
    return res.status(404).json({ message: "Book not found" });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorName = req.params.author.toLowerCase();
    let booksByAuthor = [];
    for (let bookId in books) {
        if (books[bookId].author.toLowerCase() === authorName) {
            booksByAuthor.push(books[bookId]);
        }
        }
        if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
        } else {
        return res.status(404).json({ message: "No books found by this author" });
        }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title.toLowerCase();
  let booksByTitle = [];
  for(let bookId in books){
    if(books[bookId].title.toLowerCase() === title){
        booksByTitle.push(books[bookId]);
    }
  }
  if (booksByTitle.length > 0) {
    return res.status(200).json(booksByTitle);
    } else {
    return res.status(404).json({ message: "No books found by this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let reviews = {}
  if(books[isbn]){
    if (books[isbn].reviews.length === 0) {
        return res.status(200).json({ message: "No reviews" });
      } else {
        return res.status(200).json(books[isbn].reviews);
      }
  }
  else{
    res.status(404).json({message:'Isbn not found'});
  }
  });

module.exports.general = public_users;
