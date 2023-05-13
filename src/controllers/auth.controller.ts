import { Request, Response, Router } from "express";
import { createUser, login } from "../services/auth.service";
import jwt from "jsonwebtoken";
import { config } from "../config";

const createToken = (_id: string) => {
  return jwt.sign({ _id }, config.jwtKey, { expiresIn: "3d" });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await login(email, password);

    // create a token
    const token = createToken(user.id.toString());

    res.status(200).json({ email, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const signupUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const user = await createUser(email, password, name);

    // create a token
    const token = createToken(user.id.toString());

    res.status(200).json({ email, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
