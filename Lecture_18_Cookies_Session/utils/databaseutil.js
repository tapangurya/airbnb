
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
