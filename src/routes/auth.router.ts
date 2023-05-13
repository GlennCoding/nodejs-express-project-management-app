import express from "express";
import { loginUser, signupUser } from "../controllers/auth.controller";

const authRoutes = express.Router();

authRoutes.post("/login", loginUser);

authRoutes.post("/signup", signupUser);

export default authRoutes;
