import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    const connIns = await mongoose.connect(MONGO_URI);
    console.log(
      `MongoDB!! Connected Successfully. HOST: ${connIns.connection.host}`,
    );
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDB;
