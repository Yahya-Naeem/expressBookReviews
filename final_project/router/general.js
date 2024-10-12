const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
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

//Get books asynchronously - Task 10
// public_users.get('/', async function (req, res) {
//   try {
//       // Mocking an API call using Promise.resolve
//       const bookList = await new Promise((resolve, reject) => {
//           resolve(books); // Simulate successful fetch
//       });
//       return res.status(200).json(bookList);
//   } catch (error) {
//       return res.status(500).json({ message: 'Error fetching book list' });
//   }
// });

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   let isbn = req.params.isbn
//   if(books[isbn]){
//     return res.status(200).json(books[isbn]);
//   }else {
//     return res.status(404).json({ message: "Book not found" });
//   }
//  });

// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  let isbn = req.params.isbn;
  try {
      const bookDetails = await new Promise((resolve, reject) => {
          if (books[isbn]) {
              resolve(books[isbn]); // Simulate successful fetch
          } else {
              reject(new Error("Book not found"));
          }
      });
      return res.status(200).json(bookDetails);
  } catch (error) {
      return res.status(404).json({ message: error.message });
  }
});


// Get book details based on author - task 2
// public_users.get('/author/:author',function (req, res) {
//     let authorName = req.params.author.toLowerCase();
//     let booksByAuthor = [];
//     for (let bookId in books) {
//         if (books[bookId].author.toLowerCase() === authorName) {
//             booksByAuthor.push(books[bookId]);
//         }
//         }
//         if (booksByAuthor.length > 0) {
//         return res.status(200).json(booksByAuthor);
//         } else {
//         return res.status(404).json({ message: "No books found by this author" });
//         }
// });

// Get book details based on author using async-await - task 11
public_users.get('/author/:author', async function (req, res) {
  let authorName = req.params.author.toLowerCase();
  try {
      const booksByAuthor = await new Promise((resolve, reject) => {
          const filteredBooks = [];
          for (let bookId in books) {
              if (books[bookId].author.toLowerCase() === authorName) {
                  filteredBooks.push(books[bookId]);
              }
          }
          if (filteredBooks.length > 0) {
              resolve(filteredBooks);
          } else {
              reject(new Error("No books found by this author"));
          }
      });
      return res.status(200).json(booksByAuthor);
  } catch (error) {
      return res.status(404).json({ message: error.message });
  }
});

// Get all books based on title - task 3
// public_users.get('/title/:title',function (req, res) {
//   let title = req.params.title.toLowerCase();
//   let booksByTitle = [];
//   for(let bookId in books){
//     if(books[bookId].title.toLowerCase() === title){
//         booksByTitle.push(books[bookId]);
//     }
//   }
//   if (booksByTitle.length > 0) {
//     return res.status(200).json(booksByTitle);
//     } else {
//     return res.status(404).json({ message: "No books found by this title" });
//     }
// });

// Get all books based on title using async-await - task 13
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title.toLowerCase();
  try {
      // Mocking an API call using Promise.resolve
      const booksByTitle = await new Promise((resolve, reject) => {
          const filteredBooks = [];
          for (let bookId in books) {
              if (books[bookId].title.toLowerCase() === title) {
                  filteredBooks.push(books[bookId]);
              }
          }
          if (filteredBooks.length > 0) {
              resolve(filteredBooks);
          } else {
              reject(new Error("No books found by this title"));
          }
      });

      return res.status(200).json(booksByTitle);
  } catch (error) {
      return res.status(404).json({ message: error.message });
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
