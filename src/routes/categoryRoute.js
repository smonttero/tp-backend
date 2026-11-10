import { Router } from "express";
import Controller from '../controllers/categoryController.js'

const router = Router()

router.get("/", categoryController.getCategories)

router.post("/", categoryController.createCategory)

router.delete("/:id", categoryController.deleteCategory)

export default router