import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import Adminrouter from "./routes/admin.route.js";
import studentRouter from "./routes/student.route.js";

const app = express();

//Common Middlewears:
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extends: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/student", studentRouter);
app.use("/api/v1/admin", Adminrouter);

export { app };
