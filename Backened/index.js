const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDb = require('./config/connectDb');
const router = require('./router/index.js');
const cookieParser = require('cookie-parser');
const { app, server } = require('./socket/index.js');

// Use environment variable for Mongo URI
const mongoose = require('mongoose');

// Use environment variable for PORT
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://chat-app-front-kappa.vercel.app', // Production frontend on Vercel
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Necessary for handling cookies and credentials
}));

const { Server } = require("socket.io");
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true, // Allows cookies and credentials to be sent
  },
});

// app.use(cors({
//     origin: ["https://chat-app-front-kappa.vercel.app"],
//     methods: ["POST", "GET", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
//     credentials: true,
//     optionsSuccessStatus: 200
// }));

mongoose.connect('mongodb+srv://mohitkeshari2000:mohit123@chat-app.l5erv.mongodb.net/?retryWrites=true&w=majority&appName=Chat-App');

// Additional headers to handle preflight requests
app.options('*', cors({
    origin: "https://chat-app-front-kappa.vercel.app",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Simple Hello World Route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// API endpoint
app.use("/api", router);



// Connect to DB and start server
connectDb().then(() => {
    server.listen(PORT, () => {
        console.log("connected to DB");
        console.log(`Server is running on port ${PORT}`);
    });
});
