const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Initialize the users array

const isValid = (username) => {
    // Check if the username exists in the users array
    return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    
    const user = users.find(user => user.username === username);
    
    if (!user || user.password !== password) {
        return false;
    }
    
    return true;
}


// Endpoint to handle user login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    // Check if the username exists
    if (!isValid(username)) {
        return res.status(404).json({ message: "User not found" });
    }
    // Check if the username and password match
    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    // Generate JWT token
    const token = jwt.sign({ username }, 'secret_key');
    res.json({ token });
});

// Endpoint to add a book review
regd_users.put("/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    // Check if the book with the provided ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }
    // Store the review for the book
    books[isbn].reviews = review;
    res.json({ message: "Review added successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
