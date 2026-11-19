import { Router } from "express";
import * as categoryController from '../controllers/categoryController.js'
import { isAdmin, verifyToken } from "../middleware/verifyToken.js";

const router = Router()

router.get("/", categoryController.getCategories)

router.post("/",verifyToken, isAdmin, categoryController.createCategory)

router.delete("/:id",verifyToken, isAdmin, categoryController.deleteCategory)

export default router