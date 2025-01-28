import { Router } from "express";
import {
  CreateEvent,
  diplayEvents,
  updateEvent,
} from "../controllers/event.controllers.js";
import verifyJWT from "../middleware/adminAuth.middlewres.js";
import { upload } from "../middleware/multer.middlewares.js";
const router = Router();

router
  .route("/create")
  .post(verifyJWT, upload.single("eventImage"), CreateEvent);
router.route("/display").get(verifyJWT, diplayEvents);
router
  .route("/update/:eventId")
  .patch(verifyJWT, upload.single("eventImage"), updateEvent);

export default router;
