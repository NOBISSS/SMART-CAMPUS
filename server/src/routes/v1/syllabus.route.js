import Router from "express";
import {
  checkSyllabusToAdmin,
  deleteSyllabus,
  getSyllabusForStudents,
  setSyllabus,
  updateSyllabus,
} from "../../controllers/v1/syllabus.controller.js";
import verifyJWTAdmin from "../../middleware/v1/adminAuth.middlewres.js";
import { upload } from "../../middleware/v1/multer.middlewares.js";
import verifyJWTStudent from "../../middleware/v1/studentAuth.middlewres.js";
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
