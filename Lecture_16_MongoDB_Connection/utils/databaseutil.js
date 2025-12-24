const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const mongoUrl =
  "mongodb+srv://root:root@completenodejs.sgck7ib.mongodb.net/?appName=completeNodeJS";

let _db;
const mongoConnect = (callback) => {
  mongoClient
    .connect(mongoUrl)
    .then((client) => {
      _db = client.db("airbnb");
      callback();
    })
    .catch((err) => {
      console.log("error while connecting mongo", err);
    });
};
const getDb = () => {
  if (!_db) {
    throw new Error("Mongo not connected");
  }
  return _db;
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
