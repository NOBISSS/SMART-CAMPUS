import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  getTasksBySemester,
  setStatus,
  updateTask,
} from "../controllers/task.controller.js";
import verifyJWTAdmin from "../middleware/adminAuth.middlewres.js";
import { upload } from "../middleware/multer.middlewares.js";
import { default as verifyJWT } from "../middleware/studentAuth.middlewres.js";
const router = Router();

router.route("/create").post(verifyJWTAdmin, upload.none(), createTask);
router.route("/delete/:taskId").delete(verifyJWTAdmin, deleteTask);
router
  .route("/update/:taskId")
  .patch(verifyJWTAdmin, upload.none(), updateTask);
router
  .route("/displaybysemester/:semester")
  .get(verifyJWTAdmin, getTasksBySemester);
router.route("/displayall").get(verifyJWTAdmin, getTasks);
router.route("/displaybysemesterstudent").get(verifyJWT, getTasksBySemester);
router.route("/setstatus/:taskId").patch(verifyJWT, upload.none(), setStatus);

export default router;
