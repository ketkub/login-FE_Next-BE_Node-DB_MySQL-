import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";
import { User } from "./user.model.js";

export const Cart = sequelize.define("Cart", {
  status: {
    type: DataTypes.ENUM("pending", "completed"), 
    defaultValue: "pending"
  }
});
User.hasOne(Cart, { foreignKey: "userid", as: "cart" });
Cart.belongsTo(User, { foreignKey: "userid" });
