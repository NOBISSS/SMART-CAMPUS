import { Router } from "express";
import { createTask } from "../controllers/task.controller.js";
import verifyJWTAdmin from "../middleware/adminAuth.middlewres.js";
import { upload } from "../middleware/multer.middlewares.js";

const router = Router();

router.route("/create").post(verifyJWTAdmin, upload.none(), createTask);

export default router;
