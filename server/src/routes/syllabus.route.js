import Router from "express";
import {
  deleteSyllabus,
  setSyllabus,
} from "../controllers/syllabus.controller.js";
import verifyJWTAdmin from "../middleware/adminAuth.middlewres.js";
import { upload } from "../middleware/multer.middlewares.js";
const router = Router();

router
  .route("/create")
  .post(verifyJWTAdmin, upload.single("syllabusFile"), setSyllabus);
router.route("/delete").delete(verifyJWTAdmin, deleteSyllabus);

export default router;
