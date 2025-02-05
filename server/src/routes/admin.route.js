import { Router } from "express";
import multer from "multer";
import {
  forgetPassword,
  getAdmin,
  loginAdmin,
  updatePassword,
  verifyOTP,
} from "../controllers/admin.controller.js";
import verifyJWT from "../middleware/adminAuth.middlewres.js";
const router = Router();
const upload = multer();

//unsecured routes
router.route("/login").post(upload.none(), loginAdmin);
router.route("/forgetpassword").post(upload.none(), forgetPassword);
router.route("/forgetpassword/verify").post(upload.none(), verifyOTP);

//secured routes :
router.route("/changepassword").patch(verifyJWT,upload.none(), updatePassword);
router.route("/getuser").get(verifyJWT, getAdmin);

export default router;
