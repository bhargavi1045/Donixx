import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import connectDatabase from "./config/db";
import { registerRoute } from "./routes/register.route";
dotenv.config({ path: ".env" });

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 10000;
connectDatabase()
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_ENDPOINT
].filter(Boolean) as string[];

const corsOptions = {
  origin: allowedOrigins,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json());

export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});

app.use("/api/register", registerRoute.registerRoute());


app.get("/", (req, res) => {
  res.send("Type-Script Express");
});

server.listen(port, () => {
  console.log(`Server is live at http://localhost:${port}`);
});
