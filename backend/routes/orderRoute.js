import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { getUserOrders } from "../controllers/orderController.js";
export const orderRoute = Router();

orderRoute.get('/orders', checkAuth, getUserOrders);