import { Router } from "express";
import multer from "multer";
import { hybridLogin } from "../controllers/login.controller.js";

const router = Router();
const upload = multer();

router.route("/login").post(upload.none(), hybridLogin);

export default router;
