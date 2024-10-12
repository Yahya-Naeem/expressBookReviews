const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const PORT = 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Session middleware
app.use(session({
    secret: "fingerprint_customer", // Use a strong secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Authentication middleware for protected routes
app.use("/customer/auth/*", (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: "No authorization header provided" });
    }
    const token = authHeader.split(' ')[1]; // Extract the token from "Bearer <token>"
    
    jwt.verify(token, 'access', (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user; // Save user info in the request
        next(); // Proceed to the next middleware or route handler
    });
});

// Route handlers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
