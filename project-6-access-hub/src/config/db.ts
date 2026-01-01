import mongoose from "mongoose";
import { env } from "./env";

export const connectDB = async () => {
    try {
        await mongoose.connect(env.mongoUri);
        console.log("Mongodb connected");
        
    } catch (error) {
        console.error("mongodb connection failed");
        process.exit(1);
    }
}