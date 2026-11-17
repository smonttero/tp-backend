import * as userService from "../services/userService.js";

const manejarError = (res, error) => {
  if (error.status) {
    return res.status(error.status).json({ error: error.message });
  }

  console.error(error);
  return res.status(500).json({ error: "Error interno del servidor" });
};


export const createUser = async (req, res) => {
  try {
    const usuario = await userService.createUser(req.body);
    res.status(201).json(usuario);
  } catch (error) {
    manejarError(res, error);
  }
};
