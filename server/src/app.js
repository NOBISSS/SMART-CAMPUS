import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import userRouter from "./routes/user.route.js";

const app = express();

//Common Middlewears:
app.use(
  cors({
    origin: "*",
    credentials:true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extends: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/student", userRouter);

export { app };
