import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasksBySemester,
  setStatus,
  updateTask,
} from "../controllers/task.controller.js";
import verifyJWTAdmin from "../middleware/adminAuth.middlewres.js";
import { upload } from "../middleware/multer.middlewares.js";
import verifyJWT from "../middleware/studentAuth.middlewres.js";
const router = Router();

router.route("/create").post(verifyJWTAdmin, upload.none(), createTask);
router.route("/delete/:taskId").delete(verifyJWTAdmin, deleteTask);
router
  .route("/update/:taskId")
  .patch(verifyJWTAdmin, upload.none(), updateTask);
router.route("/displaybysemester").get(verifyJWTAdmin, getTasksBySemester);
router.route("/setstatus/:taskId").patch(verifyJWT, upload.none(), setStatus);

export default router;
