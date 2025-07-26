const mongoose =require("mongoose")

/**
 * Connects to the MongoDB database.
 * This function should be called before starting the server.
 */
const connectToDatabase = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/incubytesweetdb");

    console.log("✅ MongoDB connected successfully");
     return "success"
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message); 
    // process.exit(1); // Exit the process if DB connection fails
  }
};

module.exports= connectToDatabase;
