import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import Adminrouter from "./routes/admin.route.js";
import loginRouter from "./routes/login.route.js";
import studentRouter from "./routes/student.route.js";

const app = express();

//Common Middlewears:
app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extends: true, limit: "16kb", extended: true }));
app.use(express.static("public"));

app.use("/api/v1/student", studentRouter);
app.use("/api/v1/admin", Adminrouter);
app.use("/api/v1/auth", loginRouter);
export { app };
