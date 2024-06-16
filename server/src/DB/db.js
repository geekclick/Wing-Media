import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const URL = process.env.MONGO_URI;


export const connectDB = async () => {
    try {
        await mongoose.connect(URL);
        console.log("Database is Connected")
    } catch (error) {
        console.error("This connection could not be make");
        process.exit(0);
    }
}