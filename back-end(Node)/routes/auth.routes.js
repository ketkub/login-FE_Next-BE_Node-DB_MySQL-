import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const routes = express.Router();

routes.post("/register", register);
routes.post("/login", login);


routes.get("/profile", verifyToken, (req, res) => {
  res.json({ message: `Welcome user ${  req.userId}` });
});

export default routes;