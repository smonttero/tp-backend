import * as categoryService from "../services/categoryService.js";

// Responde con el status del ErrorApp, o 500 si fue un error inesperado
const manejarError = (res, error) => {
  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "Error interno del servidor" });
};

// GET /categories
export const getCategories = async (req, res) => {
  try {
    const categorias = await categoryService.getAllCategories();
    res.status(200).json(categorias);
  } catch (error) {
    manejarError(res, error);
  }
};

// POST /categories
export const createCategory = async (req, res) => {
  try {
    const categoria = await categoryService.createCategory(req.body);
    res.status(201).json(categoria);
  } catch (error) {
    manejarError(res, error);
  }
};

// DELETE /categories/:id
export const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({ mensaje: "Categoría eliminada correctamente" });
  } catch (error) {
    manejarError(res, error);
  }
};