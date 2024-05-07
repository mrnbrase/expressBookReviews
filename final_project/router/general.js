const express = require('express');
const books = require("./booksdb.js");
const users = require("./auth_users.js").users;
const jwt = require('jsonwebtoken');
const public_users = express.Router();

public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: "Username already taken" });
    }
    const newUser = { username, password };

    users.push(newUser);
  
    return res.status(201).json({ message: "User registered successfully", user: newUser });
});

public_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!users.some(user => user.username === username)) {
        return res.status(404).json({ message: "User not found" });
    }
    if (!users.some(user => user.username === username && user.password === password)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const token = jwt.sign({ username }, 'secret_key');
    res.json({ token });
});

public_users.put("/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    
    const token = req.headers.authorization;
    
    jwt.verify(token.split(' ')[1], 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const username = decoded.username;

        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (books[isbn].reviews && books[isbn].reviews[username]) {
            books[isbn].reviews[username] = review;
        } else {
            if (!books[isbn].reviews) {
                books[isbn].reviews = {};
            }
            books[isbn].reviews[username] = review;
        }

        res.json({ message: "Review added or modified successfully" });
    });
});

public_users.delete("/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const token = req.headers.authorization;
    jwt.verify(token.split(' ')[1], 'secret_key', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        
        const username = decoded.username;

        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (books[isbn].reviews && books[isbn].reviews[username]) {
            delete books[isbn].reviews[username];
            res.json({ message: "Review deleted successfully" });
        } else {
            res.status(404).json({ message: "Review not found" });
        }
    });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const { author } = req.params;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);
  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: "Books by this author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const { title } = req.params;
  const booksWithTitle = Object.values(books).filter(book => book.title === title);
  if (booksWithTitle.length > 0) {
    res.json(booksWithTitle);
  } else {
    res.status(404).json({ message: "Books with this title not found" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (book && book.reviews) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Reviews for this book not found" });
  }
});

module.exports.general = public_users;
