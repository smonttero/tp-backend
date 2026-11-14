import * as productService from "../services/productService.js";

// Responde con el status del ErrorApp, o 500 si fue un error inesperado
const manejarError = (res, error) => {
  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "Error interno del servidor" });
};

// GET /products
export const getProducts = async (req, res) => {
  try {
    const productos = await productService.getAllProducts();
    res.status(200).json(productos);
  } catch (error) {
    manejarError(res, error);
  }
};

// GET /products/:id
export const getProductById = async (req, res) => {
  try {
    const producto = await productService.getProductById(req.params.id);
    res.status(200).json(producto);
  } catch (error) {
    manejarError(res, error);
  }
};

// POST /products
export const createProduct = async (req, res) => {
  try {
    const producto = await productService.createProduct(req.body);
    res.status(201).json(producto);
  } catch (error) {
    manejarError(res, error);
  }
};

// PATCH /products/:id
export const updateProduct = async (req, res) => {
  try {
    const producto = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json(producto);
  } catch (error) {
    manejarError(res, error);
  }
};

// DELETE /products/:id
export const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    manejarError(res, error);
  }
};
