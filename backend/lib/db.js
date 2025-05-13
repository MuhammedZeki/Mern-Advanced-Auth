const mongoose = require("mongoose");
const { config } = require("dotenv");
config();

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Success to connection Db");
  } catch (error) {
    console.log("Something wnet wrong!", error.message);
  }
};
