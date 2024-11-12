require('dotenv').config();
const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel");

const getUserDetailsFromToken = async (token) => {
    try {
        // Check if token is provided
        if (!token) {
            return {
                message: "Session expired. Please log in again.",
                logout: true
            };
        }

        // Verify the token and decode the payload
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET_KEY);

        // Find the user by the ID in the decoded payload, excluding the password
        const user = await UserModel.findById(decoded.id).select('-password');
        
        // If no user found, return a logout response
        if (!user) {
            return {
                message: "User not found. Please log in again.",
                logout: true
            };
        }

        // Return user details if found
        return user;
    } catch (error) {
        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return {
                message: "Token expired. Please log in again.",
                logout: true
            };
        } else if (error.name === 'JsonWebTokenError') {
            return {
                message: "Invalid token. Please log in again.",
                logout: true
            };
        }
        
        // Handle other errors (database or unexpected issues)
        return {
            message: "An error occurred. Please try again later.",
            logout: true
        };
    }
};

module.exports = getUserDetailsFromToken;
