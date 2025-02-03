import { Router } from "express";
import {
  createTask,
  deleteTask,
  updateTask,
} from "../controllers/task.controller.js";
import verifyJWTAdmin from "../middleware/adminAuth.middlewres.js";
import { upload } from "../middleware/multer.middlewares.js";
const router = Router();

router.route("/create").post(verifyJWTAdmin, upload.none(), createTask);
router.route("/delete/:taskId").delete(verifyJWTAdmin, deleteTask);
router
  .route("/update/:taskId")
  .patch(verifyJWTAdmin, upload.none(), updateTask);

export default router;
