import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { User } from "./user.model.js";

export const Order = sequelize.define("Order", {
  totalPrice: { type: DataTypes.FLOAT, allowNull: false },
  status: {
    type: DataTypes.ENUM("paid", "shipped", "completed", "cancelled"),
    defaultValue: "paid"
  }
});

User.hasMany(Order, { foreignKey: "userid", as: "orders" });
Order.belongsTo(User, { foreignKey: "userid" });

