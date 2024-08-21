const { MongoClient } = require("mongodb");

const url = process.env.MONGODB_URI;
const client = new MongoClient(url);

const dbName = "FBDB";

async function mongoConnect() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
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
