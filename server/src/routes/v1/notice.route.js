import { Router } from "express";
import {
  createNotice,
  deleteNotice,
  displayNotices,
  displayNoticesStudents,
  updateNotice,
} from "../../controllers/v1/notices.controllers.js";
import verifyJWT from "../../middleware/v1/adminAuth.middlewres.js";
import { upload } from "../../middleware/v1/multer.middlewares.js";
import verifyJWTStudent from "../../middleware/v1/studentAuth.middlewres.js";
const router = Router();

router
  .route("/create")
  .post(verifyJWT, upload.single("noticeImage"), createNotice);
router.route("/display").get(verifyJWT, displayNotices);
router.route("/display-students").get(verifyJWTStudent, displayNoticesStudents);
router
  .route("/update/:noticeId")
  .patch(verifyJWT, upload.single("noticeImage"), updateNotice);
router.route("/delete/:noticeId").delete(verifyJWT, deleteNotice);
export default router;
