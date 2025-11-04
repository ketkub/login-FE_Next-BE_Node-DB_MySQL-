import { setupProfileUser, updateProfileUser} from "../controllers/profileuser.controller.js";
import { upload } from "../controllers/uploadprofileuser.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import express from "express";

const router = express.Router();

router.post("/picprofile", upload.single("avatar"), setupProfileUser, verifyToken);
router.put("/picprofile/:userid", upload.single("avatar"), updateProfileUser, verifyToken);

export default router;
