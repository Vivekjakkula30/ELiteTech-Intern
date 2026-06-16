const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/chatapp");
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Database connection failed:", error.message);
  }
};

module.exports = connectDB;