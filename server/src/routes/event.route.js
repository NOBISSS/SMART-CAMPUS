import { Router } from "express";
import { CreateEvent, diplayEvents } from "../controllers/event.controllers.js";
import verifyJWT from "../middleware/adminAuth.middlewres.js";
import { upload } from "../middleware/multer.middlewares.js";
const router = Router();

router
  .route("/create")
  .post(verifyJWT, upload.single("eventImage"), CreateEvent);
router.route("/display").get(verifyJWT, diplayEvents);

export default router;
