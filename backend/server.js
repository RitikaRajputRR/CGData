const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const districtRoutes = require("./routes/districtRoutes");
const chatRoutes = require("./routes/chatRoutes");
const tourismRoutes = require("./routes/tourismRoutes");

const app = express();

// Allow all origins
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Static images
app.use("/images", express.static("public/images"));

// District API
app.use("/api/districts", districtRoutes);

// AI Chatbot API
app.use("/api/chat", chatRoutes);

// Tourism API
app.use("/api/tourism", tourismRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "CG DATA Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Atlas connected successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`District API: http://localhost:${PORT}/api/districts`);
      console.log(`Tourism API: http://localhost:${PORT}/api/tourism`);
      console.log(`Chat API: http://localhost:${PORT}/api/chat`);
    });
  } catch (error) {
    console.error("MongoDB connection error:");
    console.error(error.message);

    process.exit(1);
  }
};

startServer();