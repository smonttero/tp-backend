import mongoose from "mongoose";
import { Product } from "../models/productModel.js";
import { Category } from "../models/categoryModel.js";
import { ErrorApp } from "../utils/ErrorApp.js";

// Campos que se aceptan desde el body. Cualquier otro se ignora.
const CAMPOS_PERMITIDOS = [
  "name",
  "description",
  "price",
  "stock",
  "unit",
  "isGlutenFree",
  "isAvailable",
  "category",
];

const filtrarCampos = (data) =>
  Object.fromEntries(
    Object.entries(data ?? {}).filter(
      ([campo, valor]) => CAMPOS_PERMITIDOS.includes(campo) && valor !== undefined
    )
  );

const validarId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw new ErrorApp("El id no es válido", 400);
  }
};

// Comprueba que la categoría tenga un id válido y que exista en la base
const verificarCategoria = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw new ErrorApp("El id de la categoría no es válido", 400);
  }

  const existe = await Category.exists({ _id: categoryId });

  if (!existe) {
    throw new ErrorApp("La categoría indicada no existe", 400);
  }
};

// Convierte los errores de Mongoose en ErrorApp con el status correcto
const traducirError = (error) => {
  if (error.name === "ValidationError") {
    const mensajes = Object.values(error.errors).map((e) => e.message);
    return new ErrorApp(mensajes.join(", "), 400);
  }

  if (error.name === "CastError") {
    return new ErrorApp(`El valor de "${error.path}" no es válido`, 400);
  }

  return error;
};

// GET: todos los productos, con los datos completos de su categoría
export const getAllProducts = async () => {
  return await Product.find().populate("category").sort({ name: 1 });
};

// GET: un producto por id
export const getProductById = async (id) => {
  validarId(id);

  const producto = await Product.findById(id).populate("category");

  if (!producto) {
    throw new ErrorApp("Producto no encontrado", 404);
  }

  return producto;
};

// POST: crea un producto
export const createProduct = async (data) => {
  const campos = filtrarCampos(data);

  try {
    // Si no viene category, la validación del modelo devuelve el error
    if (campos.category !== undefined) {
      await verificarCategoria(campos.category);
    }

    const producto = await Product.create(campos);
    return await producto.populate("category");
  } catch (error) {
    throw traducirError(error);
  }
};

// PATCH: actualiza solo los campos que se envían
export const updateProduct = async (id, data) => {
  validarId(id);

  const campos = filtrarCampos(data);

  if (Object.keys(campos).length === 0) {
    throw new ErrorApp("No se enviaron campos válidos para actualizar", 400);
  }

  try {
    if (campos.category !== undefined) {
      await verificarCategoria(campos.category);
    }

    const producto = await Product.findByIdAndUpdate(id, campos, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!producto) {
      throw new ErrorApp("Producto no encontrado", 404);
    }

    return producto;
  } catch (error) {
    throw traducirError(error);
  }
};

// DELETE: elimina un producto por id
export const deleteProduct = async (id) => {
  validarId(id);

  const eliminado = await Product.findByIdAndDelete(id);

  if (!eliminado) {
    throw new ErrorApp("Producto no encontrado", 404);
  }

  return eliminado;
};