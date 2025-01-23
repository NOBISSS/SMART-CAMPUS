import { Router } from "express";
import multer from "multer";
import {
  loginStudent,
  registerStudent,
  updatePassword,
  verifyOTP,
} from "../controllers/user.controller.js";
const router = Router();
const upload = multer();

//unsecured routes
router.route("/register").post(upload.none(), registerStudent);
router.route("/register/verify").post(upload.none(), verifyOTP);
router.route("/login").post(upload.none(), loginStudent);

//secured routes :
router.route("/changepassword").post(upload.none(), updatePassword);

export default router;
