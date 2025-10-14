import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("login", "root", "root", {
  host: "localhost",
  dialect: "mysql",
});
