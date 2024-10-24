import express from "express";
import productContoller from "../controllers/productController.js";

const router = express.Router();

router.get("/", productContoller.getProducts);
router.post("/", productContoller.createProduct);
router.put("/:id", productContoller.updateProduct);
router.delete("/:id", productContoller.deleteProduct);
router.get("/search", productContoller.searchProduct);

export default router;