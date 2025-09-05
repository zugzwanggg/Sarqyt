import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkIsUserShopOwner } from "../middleware/checkIsUserShopOwner.js";
import { acceptOrder, getScanData } from "../controllers/sellerController.js";
import { checkIsUserRoleSeller } from "../middleware/checkIsUserRoleSeller.js";


export const sellerRouter = Router();

sellerRouter.patch('/scan/:orderId', checkAuth, checkIsUserRoleSeller, acceptOrder);
sellerRouter.get('/scan/:id', checkAuth, checkIsUserRoleSeller, getScanData);