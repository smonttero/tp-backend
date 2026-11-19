import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { ErrorApp } from "../utils/ErrorApp.js";
import { JWT_SECRET } from "../config/config.js";


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

export const loginUser = async (data) => {
  const { email, password } = data ?? {};

  if (!email || !password) {
    throw new ErrorApp("El email y la contraseña son obligatorios", 400);
  }

  const usuario = await User.findOne({
    email: String(email).toLowerCase().trim(),
  }).select("+password");

  const credencialesValidas =
    usuario &&
    usuario.isActive &&
    (await bcrypt.compare(String(password), usuario.password));

  if (!credencialesValidas) {
    throw new ErrorApp("Credenciales inválidas", 401);
  }
  const token = jwt.sign(
    { id: usuario._id, role: usuario.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );
  return { token, usuario };
};