import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { Order } from "./order.model.js";
import { Product } from "./product.model.js";

export const OrderItem = sequelize.define("OrderItem", {
  quantity: { 
    type: DataTypes.INTEGER, 
    allowNull: false 
},
  priceAtPurchase: { 
    type: DataTypes.FLOAT, 
    allowNull: false 
}
});

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });
OrderItem.belongsTo(Product, { foreignKey: "productId" });
