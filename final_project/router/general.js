const express = require('express');
let books = require("./booksdb.js");
let users = require("./auth_users.js").users;
const public_users = express.Router();
const jwt = require('jsonwebtoken');

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

module.exports.general = public_users;
