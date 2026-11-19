import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/config.js";

export const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  const token = header.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido o vencido" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json({ error: "No tenés permisos para realizar esta acción" });
  }

  next();
};
