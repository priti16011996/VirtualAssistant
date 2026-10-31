import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MonogoDb Connected Succesfully");
  } catch (error) {
    console.log(`Failed to connect to db due to error: ${error}`);
  }
};
