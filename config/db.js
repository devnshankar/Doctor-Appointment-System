const mongoose = require("mongoose");
const colors = require("colors");

//* CONNECTION TO MONGODB CONFIGURATION
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(` MongoDb connected at:- ${mongoose.connection.host} `.bgGreen.black);
  } catch (error) {
    console.log(`Mongodb server issue:- ${error}`.bgRed.white);
  }
};

module.exports = connectDB;