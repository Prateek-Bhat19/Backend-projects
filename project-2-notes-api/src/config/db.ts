import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongouri = process.env.MONGODB_URI;

    if (!mongouri) {
      throw new Error("MONGODB_URI is not defined");
    }

    await mongoose.connect(mongouri);
    console.log("mongodb connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

export default connectDB;