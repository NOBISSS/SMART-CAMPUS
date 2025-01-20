import { Router } from "express";
import { registerStudent } from "../controllers/user.controller.js";
import multer from 'multer';
const router = Router();
const upload = multer();

//unsecured routes
router.route("/register").post( upload.none() ,registerStudent);



export default router;