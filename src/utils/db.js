import mongoose from "mongoose";
import { MONGO_URI } from "./config";

export const conectarDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connect to ${mongoose.connect.name}`);
  } catch (error) {
    console.error(`Could not connect ${error.message}`);
    process.exit(1);
  }
};
