import { Router } from "express";
import multer from "multer";
import {
  forgetPassword,
  loginAdmin,
  verifyOTP,
} from "../controllers/admin.controller.js";
const router = Router();
const upload = multer();

//unsecured routes
router.route("/login").post(upload.none(), loginAdmin);
router.route("/forgetpassword").post(upload.none(), forgetPassword);
router.route("/forgetpassword/verify").post(upload.none(), verifyOTP);

//secured routes :
// router.route("/changepassword").post(upload.none(), updatePassword);

export default router;
