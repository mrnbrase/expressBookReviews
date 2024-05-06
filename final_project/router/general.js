const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.json(books);
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const { isbn } = req.params;
    const book = books[isbn];
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const { author } = req.params;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({ message: "Books by this author not found" });
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const { title } = req.params;
    const booksWithTitle = Object.values(books).filter(book => book.title === title);
    if (booksWithTitle.length > 0) {
        res.json(booksWithTitle);
    } else {
        res.status(404).json({ message: "Books with this title not found" });
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const { isbn } = req.params;
    const book = books[isbn];
    if (book && book.reviews) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ message: "Reviews for this book not found" });
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
