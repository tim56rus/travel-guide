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
    origin: "https://lp.poosdisfun.xyz",
    credentials: true,
  })
);
app.use(bodyParser.json());

// set up CORS headers
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
    // regex for case-insensitive matching on username/email
    const results = await db
      .collection("Users")
      .find({
        $or: [
          { Username: { $regex: new RegExp(`^${login}$`, "i") } },
          { Email: { $regex: new RegExp(`^${login}$`, "i") } },
        ],
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

  // helper function to convert strings to Title Case
  const toTitleCase = (str) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  try {
    // connect to the "TravelGuide" db
    const db = client.db("TravelGuide");

    // check if the username or email already exists
    const existingUser = await db.collection("Users").findOne({
      $or: [
        { Username: { $regex: new RegExp(`^${username}$`, "i") } },
        { Email: { $regex: new RegExp(`^${email}$`, "i") } },
      ],
    });

    if (existingUser) {
      // if user found, set error message
      error = "Username or Email already exists.";
    } else {
      // otherwise, create a new user
      // convert firstName and lastName to title case, email to lower case
      const newUser = {
        FirstName: toTitleCase(firstName),
        LastName: toTitleCase(lastName),
        Username: username,
        Email: email.toLowerCase(),
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

// start the express server on port 5000
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
