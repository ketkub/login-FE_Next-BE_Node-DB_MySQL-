import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { Category } from "./category.model.js";

export const Product = sequelize.define("Product", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
  price: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  InStock: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Category.hasMany(Product, {
  foreignKey: "categoryId",
  onDelete: "SET NULL",
});

Product.belongsTo(Category, {
  foreignKey: "categoryId",
});
