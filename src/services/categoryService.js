import mongoose from "mongoose";
import { Category } from "../models/categoryModel.js";
import { ErrorApp } from "../utils/ErrorApp.js";

// GET: devuelve todas las categorías ordenadas por nombre
export const getAllCategories = async () => {
  return await Category.find().sort({ name: 1 });
};

// POST: crea una categoría nueva
export const createCategory = async (data) => {
  const { name, description } = data ?? {};

  try {
    return await Category.create({ name, description });
  } catch (error) {
    // Nombre repetido (índice único)
    if (error.code === 11000) {
      throw new ErrorApp("Ya existe una categoría con ese nombre", 409);
    }

    // Falló alguna validación del modelo
    if (error.name === "ValidationError") {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      throw new ErrorApp(mensajes.join(", "), 400);
    }

    throw error;
  }
};

// DELETE: elimina una categoría por id
export const deleteCategory = async (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ErrorApp("El id no es válido", 400);
  }

  const eliminada = await Category.findByIdAndDelete(id);

  if (!eliminada) {
    throw new ErrorApp("Categoría no encontrada", 404);
  }

  return eliminada;
};