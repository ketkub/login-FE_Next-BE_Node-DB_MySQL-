import { setupProfileUser, showProfileUser, updateProfileUser} from "../controllers/profileuser.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/profile", setupProfileUser, verifyToken);
router.get("/profile/:userid", showProfileUser, verifyToken);
router.put("/profile/:userid", updateProfileUser, verifyToken);

export default router;