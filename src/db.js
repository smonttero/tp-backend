import mongoose from "mongoose";
import { MONGO_URI } from "./utils/config.js";

export const conectarDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connect to ${mongoose.connect.name}`);
  } catch (error) {
    console.error(`Could not connect ${error.message}`);
    procces.exit(1);
  }
};
