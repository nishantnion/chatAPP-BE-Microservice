require('dotenv').config()
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const messageRoutes = require("./routes/messageRoutes");
const groupRoutes = require("./routes/groupRoutes");
const { initializeIO } = require("./services/socketService"); // Import the socket.js module

// const publishMessageToQueue = require('./messageService');

const app = express();
const server = http.createServer(app);

// Parse JSON request bodies
app.use(express.json());

// Routes
app.use("/messages", messageRoutes);
app.use("/groups", groupRoutes);

const port = process.env.PORT || 3002;
const mongoUrl =
  "mongodb+srv://nishantsisodiya:4wiUCULHoY3a1XUT@chathub-cluster.mk2kv8m.mongodb.net/?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB.");
    server.listen(port, () => {
      console.log(`Messaging service started on http://localhost:${port}`);
    });

    // Initialize Socket.io after the server starts listening
    initializeIO(server);
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
  });
