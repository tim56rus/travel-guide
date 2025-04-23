const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const path = require('path');

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
      maxAge: 1000 * 60 * 30,
    },
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
app.get("/api/account/populate", accountPopulateAPI);

const checkSessionAPI = require("./backend/checkSession");
app.get("/api/checkSession", checkSessionAPI);

const searchTripsAPI = require("./backend/searchTrips");
app.get("/api/searchTrips", searchTripsAPI);

const logoutAPI = require("./backend/logout");
app.post("/api/logout", logoutAPI);

const createTripAPI = require("./backend/createTrip");
app.post("/api/createTrip", createTripAPI);


//Need for accessing the uploads for display
app.use('/uploads', express.static(path.join(__dirname,'backend', 'uploads')));

const {
  listFiles,
  uploadFile,
  getFile,
  deleteFile
} = require('./backend/fileManagement');
app.get('/api/files', listFiles);
app.post('/api/upload', uploadFile);
app.get('/api/files/:filename', getFile);
app.delete('/api/files/:filename', deleteFile);

const { createTrip, getTrips, deleteTrip, updateTrip, deleteTripPhoto} = require("./backend/tripDetails");
app.post("/api/trips", createTrip);
app.get("/api/trips", getTrips);
app.delete("/api/trips/:id", deleteTrip);
app.put("/api/trips/:id", updateTrip);
app.delete("/api/photo/:tripId/:filename", deleteTripPhoto);
// start the express server on port 5000
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
