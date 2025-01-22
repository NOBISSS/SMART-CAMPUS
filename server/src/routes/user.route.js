import { Router } from "express";
import { registerStudent, verifyOTP,  } from "../controllers/user.controller.js";
import multer from 'multer';
const router = Router();
const upload = multer();

//unsecured routes
router.route("/register").post( upload.none() ,registerStudent);
router.route("/register/verify").post( upload.none() ,verifyOTP);



export default router;