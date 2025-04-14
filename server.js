const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const url =
  "mongodb+srv://tim56rus:ZQzyfMmhOOUfHrhP@cluster0.x3n5qfd.mongodb.net/TravelGuide?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url);
client.connect();

const app = express();
app.use(
  cors({
    origin: "https://mern.nosikcompsci.com",
    credentials: true,
  })
);
app.use(bodyParser.json());

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

// ======= API Endpoints ======= //

// Login
app.post("/api/login", async (req, res) => {
  let error = "";
  const { login, password } = req.body;
  // login = either username or email

  try {
    // connect to the "TravelGuide" db
    const db = client.db("TravelGuide");

    // find user with matching username/email and password
    const results = await db
      .collection("Users")
      .find({
        $or: [{ Username: login }, { Email: login }],
        Password: password,
      })
      .toArray();

    let id = -1;
    let fn = "";
    let ln = "";
    let userName = "";

    if (results.length > 0) {
      // user found
      id = results[0]._id;
      fn = results[0].FirstName;
      ln = results[0].LastName;
      userName = results[0].Username;
    } else {
      error = "Invalid username/email or password";
    }

    const ret = {
      id: id,
      firstName: fn,
      lastName: ln,
      username: userName,
      error: error,
    };
    res.status(200).json(ret);
  } catch (e) {
    const ret = {
      id: -1,
      firstName: "",
      lastName: "",
      username: "",
      error: e.toString(),
    };
    res.status(200).json(ret);
  }
});

// Sign Up
app.post("/api/signup", async (req, res) => {
  let error = "";
  let success = "";

  // destructure fields from the sign up form
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // connect to the "TravelGuide" db
    const db = client.db("TravelGuide");

    // check if the username or email already exists
    const existingUser = await db
      .collection("Users")
      .findOne({ $or: [{ Username: username }, { Email: email }] });

    if (existingUser) {
      // if user found, set error message
      error = "Username or Email already exists.";
    } else {
      // otherwise, create a new user
      const newUser = {
        FirstName: firstName,
        LastName: lastName,
        Username: username,
        Email: email,
        Password: password,
      };

      await db.collection("Users").insertOne(newUser);
      success = "Account created successfully!";
    }

    const ret = { error: error, success: success };
    res.status(200).json(ret);
  } catch (e) {
    const ret = {
      error: e.toString(),
      success: "",
    };

    res.status(200).json(ret);
  }
});

// Start the Express server on port 5000
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
