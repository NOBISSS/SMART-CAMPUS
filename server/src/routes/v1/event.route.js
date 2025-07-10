import { Router } from "express";
import verifyJWT from "../../middleware/v1/adminAuth.middlewres.js";
import { upload } from "../../middleware/v1/multer.middlewares.js";
import verifyJWTStudent from "../../middleware/v1/studentAuth.middlewres.js";
import {
  CreateEvent,
  deleteEvent,
  displayEvents,
  displayEventsStudents,
  updateEvent,
} from "../../controllers/v1/event.controllers.js";
const router = Router();

router
  .route("/create")
  .post(verifyJWT, upload.single("eventImage"), CreateEvent);
router.route("/display").get(verifyJWT, displayEvents);
router.route("/display-students").get(verifyJWTStudent, displayEventsStudents);
router
  .route("/update/:eventId")
  .patch(verifyJWT, upload.single("eventImage"), updateEvent);
router.route("/delete/:eventId").delete(verifyJWT, deleteEvent);
export default router;
