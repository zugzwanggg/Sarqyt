import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkIsUserShopOwner } from "../middleware/checkIsUserShopOwner.js";
import { acceptOrder, getScanData } from "../controllers/sellerController.js";


export const sellerRouter = Router();

sellerRouter.patch('/scan', checkAuth, checkIsUserShopOwner, acceptOrder);
sellerRouter.get('/scan/:id', checkAuth, checkIsUserShopOwner, getScanData);