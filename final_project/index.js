const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Set up session middleware
app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Custom authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if token is provided in request headers
    const token = req.headers.authorization;

    // If no token provided, return 401 Unauthorized
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, "your_secret_key_here");
        // Set user information in session
        req.session.user = decoded.user;
        next(); // Move to next middleware
    } catch (err) {
        // Token is invalid
        return res.status(403).json({ message: "Forbidden: Invalid token" });
    }
});

// Define routes
const PORT = 5000;
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
