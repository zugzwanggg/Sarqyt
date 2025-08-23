import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { getOrderById, getUserOrders } from "../controllers/orderController.js";
export const orderRoute = Router();

orderRoute.get('/orders', checkAuth, getUserOrders);
orderRoute.get('/orders/:id', checkAuth, getOrderById);