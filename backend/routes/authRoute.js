import { Router } from "express";
import { isLogged, login, logout, register } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/isLogged', isLogged);
authRouter.get('/logout', logout);