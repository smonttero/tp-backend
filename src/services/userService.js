import { User } from "../models/userModel.js";
import { ErrorApp } from "../utils/ErrorApp.js";

export const createUser = async (data) => {
  const { name, email, password } = data ?? {};

  try {
    return await User.create({ name, email, password });
  } catch (error) {
    if (error.code === 11000) {
      throw new ErrorApp("Ya existe un usuario con ese email", 409);
    }

    if (error.name === "ValidationError") {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      throw new ErrorApp(mensajes.join(", "), 400);
    }

    throw error;
  }
};
