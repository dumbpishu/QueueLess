import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/queueless";

        if (!mongoURI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        const connIns = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${connIns.connection.host}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;