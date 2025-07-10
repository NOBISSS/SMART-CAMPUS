import { Router } from "express";
import multer from "multer";
import {
  hybridForgetPassword,
  hybridLogin,
  verifyHybridOTP,
} from "../../controllers/v1/hybrid.controller.js";

const router = Router();
const upload = multer();

router.route("/login").post(upload.none(), hybridLogin);
router.route("/forgetpassword").post(upload.none(), hybridForgetPassword);
router.route("/forgetpassword/verify").post(upload.none(), verifyHybridOTP);

export default router;
