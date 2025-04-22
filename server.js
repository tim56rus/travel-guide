const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


// Connect to db, use client for all db things
const db = require("./backend/connectdb");



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

// Import Login Handler
const loginAPI = require("./backend/login");
// Add Login API to site
app.post("/api/login", loginAPI);

// Import Signup Handler
const signupAPI = require("./backend/signup");
// Add Signup API to site
app.post("/api/signup", signupAPI);

// Import Account Update Handler
const accountUpdateAPI = require("./backend/accountUpdate");
// Add Account Update API to site
app.put("/api/account/update", accountUpdateAPI);

// Import Account Populate Handler
const accountPopulateAPI = require("./backend/accountPopulate");
// Add Account Populate API to site
app.get("/api/account/:userId", accountPopulateAPI);

// start the express server on port 5000
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
