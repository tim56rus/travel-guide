const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const url =
  "mongodb+srv://tim56rus:ZQzyfMmhOOUfHrhP@cluster0.x3n5qfd.mongodb.net/TravelGuide?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}
connectDB();

// Start the Express server on port 5000
app.listen(5000, () => {
  console.log("Server running on port 5000");
});

// Set up CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});
