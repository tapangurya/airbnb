// const mongodb = require("mongodb");
// const mongoClient = mongodb.MongoClient;
// const mongoUrl =
//   "mongodb+srv://root:root@completenodejs.sgck7ib.mongodb.net/?appName=completeNodeJS";

// let _db;
// const mongoConnect = (callback) => {
//   mongoClient
//     .connect(mongoUrl)
//     .then((client) => {
//       _db = client.db("airbnb");
//       callback();
//     })
//     .catch((err) => {
//       console.log("Error while connecting mongodb", err);
//     });
// };
// const getDb = () => {
//   if (!_db) {
//     throw new Error("Mongo not connected");
//   }
//   return _db;
// };
// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;

const mongoose = require("mongoose");

const mongoUrl =
  "mongodb+srv://root:root@completenodejs.sgck7ib.mongodb.net/airbnb?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected (Mongoose) ✅");
  } catch (err) {
    console.error("MongoDB connection failed ❌", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
