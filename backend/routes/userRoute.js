import { Router } from "express";
import { becomeSeller, changeUserCity, changeUserCountry, changeUsername, getCities, getUserFavorites, getUserInfo, search } from "../controllers/userController.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkIsAdmin } from "../middleware/checkIsAdmin.js";

export const userRouter = Router();

userRouter.get('/user', checkAuth, getUserInfo);
userRouter.patch('/user/name', checkAuth, changeUsername);
userRouter.patch('/user/country', checkAuth, changeUserCountry);
userRouter.patch('/user/city', checkAuth, changeUserCity);
userRouter.get('/favorites', checkAuth, getUserFavorites);
userRouter.get('/cities', checkAuth, getCities);
userRouter.get('/search', checkAuth, search);

userRouter.patch('/user/:id/seller', checkAuth, checkIsAdmin, becomeSeller);