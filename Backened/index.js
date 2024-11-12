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

app.use(cors({
    origin: ["https://chat-app-front-phi.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true,
    optionsSuccessStatus: 200
}));

mongoose.connect('mongodb+srv://mohitkeshari2000:mohit123@chat-app.l5erv.mongodb.net/?retryWrites=true&w=majority&appName=Chat-App');


app.use(express.json());
app.use(cookieParser());

// Simple Hello World Route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// API endpoint
app.use("/api", router);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://chat-app-front-phi.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Connect to DB and start server
connectDb().then(() => {
    server.listen(PORT, () => {
        console.log("connected to DB");
        console.log(`Server is running on port ${PORT}`);
    });
});
