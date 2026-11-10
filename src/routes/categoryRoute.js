import { Router } from "express";
import * as categoryController from '../controllers/categoryController.js'

const router = Router()

router.get("/", categoryController.getCategories)

router.post("/", categoryController.createCategory)

router.delete("/:id", categoryController.deleteCategory)

export default router