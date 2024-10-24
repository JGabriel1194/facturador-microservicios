import express from "express";
import categoryContoller from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", categoryContoller.getCategories);
router.post("/", categoryContoller.createCategory);
router.put("/:id", categoryContoller.updateCategory);
router.delete("/:id", categoryContoller.deleteCategory);
router.get("/search", categoryContoller.searchCategories);

export default router;
