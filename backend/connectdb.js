// This file provides a connection for the api to the db
const { MongoClient } = require("mongodb");

const url = 
  "mongodb+srv://tim56rus:ZQzyfMmhOOUfHrhP@cluster0.x3n5qfd.mongodb.net?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url);

client.connect();

const db = client.db("TravelGuide");

module.exports = db;