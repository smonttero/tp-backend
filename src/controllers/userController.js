import * as userService from "../services/userService.js";

const manejarError = (res, error) => {
  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "Error interno del servidor" });
};

// POST /users (registro)
export const createUser = async (req, res) => {
  try {
    const usuario = await userService.createUser(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    manejarError(res, error);
  }
};

// POST /users/login
export const loginUser = async (req, res) => {
  try {
    const resultado = await userService.loginUser(req.body);
    res.status(200).json(resultado);
  } catch (error) {
    manejarError(res, error);
  }
};
