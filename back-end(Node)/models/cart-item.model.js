import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { Cart } from "./cart.model.js";
import { Product } from "./product.model.js";

export const CartItem = sequelize.define("CartItem", {
  quantity: { 
    type: DataTypes.INTEGER, 
    defaultValue: 1 }
});

Cart.hasMany(CartItem, { foreignKey: "cartId", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cartId" });

Product.hasMany(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "Product" });
