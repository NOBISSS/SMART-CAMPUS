import { Router } from "express";
import {
  CreateNotice,
  deleteNotice,
  displayNotices,
  displayNoticesStudents,
  updateNotice,
} from "../controllers/notices.controllers.js";
import verifyJWT from "../middleware/adminAuth.middlewres.js";
import { upload } from "../middleware/multer.middlewares.js";
import verifyJWTStudent from "../middleware/studentAuth.middlewres.js";
const router = Router();

router
  .route("/create")
  .post(verifyJWT, upload.single("noticeImage"), CreateNotice);
router.route("/display").get(verifyJWT, displayNotices);
router.route("/display-students").get(verifyJWTStudent, displayNoticesStudents);
router
  .route("/update/:NoticeId")
  .patch(verifyJWT, upload.single("noticeImage"), updateNotice);
router.route("/delete/:NoticeId").delete(verifyJWT, deleteNotice);
export default router;
