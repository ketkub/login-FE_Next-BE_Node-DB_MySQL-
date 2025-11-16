import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.config.js";

export const Category = sequelize.define("Category", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, 
  },
});

