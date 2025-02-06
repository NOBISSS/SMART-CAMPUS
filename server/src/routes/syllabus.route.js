import Router from "express";
import { setSyllabus } from "../controllers/syllabus.controller.js";
import verifyJWTAdmin from "../middleware/adminAuth.middlewres.js";
import { upload } from "../middleware/multer.middlewares.js";
const router = Router();

router
  .route("/create")
  .post(verifyJWTAdmin, upload.single("syllabusFile"), setSyllabus);

export default router;
