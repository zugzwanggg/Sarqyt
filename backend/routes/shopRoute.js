import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { addUserShop, deleteShop, editShop, getShopById, getShopSarqytsById } from "../controllers/shopController.js";
import { checkIsUserRoleSeller } from "../middleware/checkIsUserRoleSeller.js";
import { checkIsUserShopOwner } from "../middleware/checkIsUserShopOwner.js";
import { uploadImage } from "../middleware/uploadImage.js";

export const shopRouter = Router();
shopRouter.get('/shops/:id', checkAuth, getShopById);
shopRouter.get('/shops/:shopId/sarqyts', checkAuth, getShopSarqytsById);

shopRouter.post('/shops', checkAuth, checkIsUserRoleSeller, addUserShop);
shopRouter.put('/shops.:shopId', checkAuth, checkIsUserRoleSeller, checkIsUserShopOwner, uploadImage.single('image'), editShop);
shopRouter.delete('/shops/:shopdId', checkAuth, checkIsUserShopOwner, deleteShop);