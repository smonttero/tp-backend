import { Router } from "express";
import * as productController from "../controllers/productController.js"
import { verifyToken, isAdmin } from "../middleware/verifyToken.js";

const router = Router()

router.get("/", productController.getProducts)

router.get("/:id", productController.getProductById)

router.post("/", verifyToken, isAdmin, productController.createProduct)

router.patch("/:id", verifyToken, isAdmin, productController.updateProduct)

router.delete("/:id", verifyToken, isAdmin, productController.deleteProduct)

export default router
