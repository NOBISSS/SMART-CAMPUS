import Router from "express";
import {
  checkSyllabusToAdmin,
  deleteSyllabus,
  getSyllabusForStudents,
  setSyllabus,
  updateSyllabus,
} from "../controllers/syllabus.controller.js";
import verifyJWTAdmin from "../middleware/adminAuth.middlewres.js";
import { upload } from "../middleware/multer.middlewares.js";
import verifyJWTStudent from "../middleware/studentAuth.middlewres.js";
const router = Router();

router
  .route("/create")
  .post(verifyJWTAdmin, upload.single("syllabusFile"), setSyllabus);
router.route("/delete").delete(verifyJWTAdmin, deleteSyllabus);
router.route("/update").patch(verifyJWTAdmin, updateSyllabus);
router.route("/getbysemester").get(verifyJWTAdmin, checkSyllabusToAdmin);
router
  .route("/getbysemesterstudent")
  .get(verifyJWTStudent, getSyllabusForStudents);

export default router;
