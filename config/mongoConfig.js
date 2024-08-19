const { MongoClient } = require("mongodb");
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

// Database Name
const dbName = "FBDB";

async function mongoConnect() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  // the following code examples can be pasted here...

  return "done.";
}

function getDatabase() {
  const db = client.db(dbName);
  return db;
}

module.exports = {
  getDatabase,
  mongoConnect,
};
