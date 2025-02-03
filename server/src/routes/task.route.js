import { Router } from "express";
import { createTask, deleteTask } from "../controllers/task.controller.js";
import verifyJWTAdmin from "../middleware/adminAuth.middlewres.js";
import { upload } from "../middleware/multer.middlewares.js";
const router = Router();

router.route("/create").post(verifyJWTAdmin, upload.none(), createTask);
router.route("/delete/:taskId").delete(verifyJWTAdmin, deleteTask);

export default router;
