const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "https://lp.poosdisfun.xyz",
    credentials: true,
  }),
  session({
    secret: "SECRETKEY",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 1
    }
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

// Each first line is the handler and second line is the actual api endpoint
const loginAPI = require("./backend/login");
app.post("/api/login", loginAPI);

const signupAPI = require("./backend/signup");
app.post("/api/signup", signupAPI);

const accountUpdateAPI = require("./backend/accountUpdate");
app.put("/api/account/update", accountUpdateAPI);

const accountPopulateAPI = require("./backend/accountPopulate");
app.get("/api/account/:userId", accountPopulateAPI);

const checkSessionAPI = require("./backend/checkSession");
app.get("/api/checkSession", checkSessionAPI);

const searchTripsAPI = require("./backend/searchTrips");
app.get("/api/searchTrips", searchTripsAPI);

// start the express server on port 5000
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
