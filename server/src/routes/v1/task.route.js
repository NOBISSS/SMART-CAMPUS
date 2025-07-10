import { Router } from "express";
import {
  createTask,
  deleteTask,
  getTasks,
  getTasksBySemester,
  getTasksBySemesterStudents,
  setStatus,
  updateTask,
} from "../../controllers/v1/task.controller.js";
import verifyJWTAdmin from "../../middleware/v1/adminAuth.middlewres.js";
import { upload } from "../../middleware/v1/multer.middlewares.js";
import { default as verifyJWT } from "../../middleware/v1/studentAuth.middlewres.js";
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
router
  .route("/displaybysemesterstudent")
  .get(verifyJWT, getTasksBySemesterStudents);
router.route("/setstatus/:taskId").patch(verifyJWT, upload.none(), setStatus);

export default router;
