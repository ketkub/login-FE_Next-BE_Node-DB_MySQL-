import { createProduct, deleteProduct, getallProducts, getProductById, updateProduct, uploadProductImage, getAllCategories, createCategory, updateCategory, deleteCategory} from "../controllers/crudproduct.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { verifyAdmin } from "../middleware/admin.middleware.js";
import express from "express";

const router = express.Router();

router.post("/products", verifyAdmin, uploadProductImage.single("image"), createProduct);
router.get("/products", getallProducts);
router.get("/products/:id", getProductById);
router.put("/products/:id", verifyAdmin, uploadProductImage.single("image"), updateProduct);
router.delete("/products/:id", verifyAdmin, deleteProduct);
router.get("/categories", getAllCategories);
router.post("/categories", verifyAdmin, createCategory);
router.put("/categories/:id", verifyAdmin, updateCategory);
router.delete("/categories/:id", verifyAdmin, deleteCategory);


export default router;