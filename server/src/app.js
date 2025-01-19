import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();

//Common Middlewears:
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use(express.static("public"));
app.use(cookieParser());

export { app };
