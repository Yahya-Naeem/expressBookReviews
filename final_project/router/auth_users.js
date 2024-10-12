const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{'username':'yahya','password':'test123'}];

const isValid = (username)=>{ 
    let validUsers = users.filter(user => {
        return (user.username === username) 
    })
    return validUsers.length > 0;
    }
const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let username = req.body.username;
    let password = req.body.password
    if(!username || !password){
        return res.status(404).json({message:'Error logging in '});
    }
    if(authenticatedUser(username,password)){
        let accesstoken = jwt.sign({
            data:password
        },'access',{ expiresIn: 60*60 })
        //storing accesstoken in session
        req.session.authorization = {
            accesstoken , username
        }
        res.status(200).json({ message: 'Logged In successfully', accesstoken });
        
    }
    else{
        res.status(208).json({message:'Invalid username or Password'});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  const {review} = req.query;
  if(!books[isbn]){
    return res.status(404).json({ message: "Book not found" });
  }
  const username = req.session.authorization.username;
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }
  if (books[isbn].reviews[username]) {
    // Modify the existing review
    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review updated successfully", review });
  } else {
    // Add a new review
    books[isbn].reviews[username] = review;
    return res.status(201).json({ message: "Review added successfully", review });
  }
});

//delete a book review 
regd_users.delete("/auth/review/:isbn",(req,res) => {
    let isbn = req.params.isbn;
    if(books[isbn]){
        let username = req.session.authorization.username;
        if(books[isbn].reviews[username]){
            delete books[isbn].reviews[username];
            return res.status(200).json({ message: "Review deleted successfully" });
        }
        else {
            return res.status(404).json({ message: "Review not found" });
        }
    }
    else{
        res.status(404).json({message:"Book not found"});
    }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
