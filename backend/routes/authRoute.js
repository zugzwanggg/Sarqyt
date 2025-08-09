import { Router } from "express";
import { isLogged, login, logout, register, telegramAuth } from "../controllers/authController.js";

export const authRouter = Router();

authRouter.post('/auth/telegram', telegramAuth);
authRouter.post('/login', login);
authRouter.post('/register', register);
authRouter.get('/isLogged', isLogged);
authRouter.get('/logout', logout);