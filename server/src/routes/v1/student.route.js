import { Router } from "express";
import multer from "multer";
import {
  forgetPassword,
  getStudent,
  loginStudent,
  registerStudent,
  updatePassword,
  verifyForgetPasswordOTP,
  verifyOTP,
} from "../../controllers/v1/student.controller.js";
import verifyJWT from "../../middleware/v1/studentAuth.middlewres.js";
const router = Router();
const upload = multer();

//unsecured routes
router.route("/register").post(upload.none(), registerStudent);
router.route("/register/verify").post(upload.none(), verifyOTP);
router.route("/login").post(upload.none(), loginStudent);
router.route("/forgetpassword").post(upload.none(), forgetPassword);
router
  .route("/forgetpassword/verify")
  .post(upload.none(), verifyForgetPasswordOTP);

//secured routes :
router.route("/changepassword").patch(verifyJWT, upload.none(), updatePassword);
router.route("/getuser").get(verifyJWT, getStudent);

export default router;
