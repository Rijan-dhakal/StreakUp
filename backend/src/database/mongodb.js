import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    const resp = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`DB connected: ${resp.connection.host}`);
  } catch (error) {
    console.log("Error connecting to database: ", error.message)
    process.exit(1)
  }
};
