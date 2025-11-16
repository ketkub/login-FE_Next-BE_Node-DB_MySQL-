import { Product } from "../models/Product.model.js";
import { Category } from "../models/category.model.js";
import multer from "multer";
import path from "path";
import { Op, fn, col } from "sequelize";

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, "product-" + Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Invalid file type"), false);
  }
  cb(null, true);
};

export const uploadProductImage = multer({ storage, fileFilter });


// =================== CREATE PRODUCT ===================
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, brand, InStock } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : null;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    // ตรวจสอบว่า categoryId มีอยู่จริงไหม
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ message: "Invalid categoryId" });
    }

    const newProduct = await Product.create({
      name,
      description,
      price,
      image,
      categoryId,
      brand,
      InStock,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating product", error: error.message });
  }
};


// =================== GET ALL PRODUCTS ===================
export const getallProducts = async (req, res) => {
  try {
    let { page, limit, q, brand, categoryId, maxPrice } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (q) {
      whereClause.name = { [Op.like]: `%${q}%` };
    }

    if (brand) {
      whereClause.brand = {
        [Op.like]: `%${brand}%`
      };
    }

    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    if (maxPrice) {
      whereClause.price = { [Op.lte]: parseFloat(maxPrice) };
    }

    const { count, rows } = await Product.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      include: [{ model: Category }],
      order: [["id", "ASC"]],
    });

    res.json({
      success: true,
      count: rows.length,
      totalProducts: count,
      data: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};


// =================== GET PRODUCT BY ID ===================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category }],
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
    });
  }
};


// =================== UPDATE PRODUCT ===================
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, categoryId, brand, InStock } = req.body;
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Validate categoryId
    if (categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(400).json({ message: "Invalid categoryId" });
      }
      product.categoryId = categoryId;
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    product.brand = brand || product.brand;
    product.InStock = InStock || product.InStock;

    await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};


// =================== DELETE PRODUCT ===================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};

// =================== GET Category ===================
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching categories", error: error.message });
    }
};

// =================== Post Category ===================
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = await Category.create({ name });

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating category", error: error.message });
    }
};

// =================== Update Category ===================
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;

    await category.save();

    res.status(200).json({
      message: "Category updated successfully",
      category,
    });
    } catch (error) {
    res.status(400).json({
        message: "Error updating category",
      error: error.message,
    });
  }
};  

// =================== Delete Category ===================
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting category",
      error: error.message,
    });
  }
};


