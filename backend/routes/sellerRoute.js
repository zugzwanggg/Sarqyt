import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { checkIsUserShopOwner } from "../middleware/checkIsUserShopOwner.js";
import { acceptOrder, cancelOrder, completeOrder, createProduct, createSarqyt, getDashboardData, getRecentOrders, getScanData, getSellerProductById, getSellerProductSarqyts, getSellerProducts, getSellerShopData } from "../controllers/sellerController.js";
import { checkIsUserRoleSeller } from "../middleware/checkIsUserRoleSeller.js";
import { uploadImage } from "../middleware/uploadImage.js";


export const sellerRouter = Router();

sellerRouter.patch('/scan/:orderId/cancel', checkAuth, checkIsUserRoleSeller, cancelOrder);
sellerRouter.patch('/scan/:orderId/confirm', checkAuth, checkIsUserRoleSeller, acceptOrder);
sellerRouter.patch('/scan/:orderId', checkAuth, checkIsUserRoleSeller, completeOrder);
sellerRouter.get('/scan/:id', checkAuth, checkIsUserRoleSeller, getScanData);
sellerRouter.get('/seller/', checkAuth, checkIsUserRoleSeller, getSellerShopData);

sellerRouter.get('/seller/:shopId/products', checkAuth, checkIsUserRoleSeller, checkIsUserShopOwner, getSellerProducts);
sellerRouter.get('/dashboard/:shopId', checkAuth, checkIsUserRoleSeller, checkIsUserShopOwner, getDashboardData);
sellerRouter.get('/seller/:shopId/orders/', checkAuth, checkIsUserRoleSeller, checkIsUserShopOwner, getRecentOrders);
sellerRouter.get('/seller/:shopId/products/:productId', checkAuth, checkIsUserRoleSeller, checkIsUserShopOwner, getSellerProductById);
sellerRouter.get('/seller/:shopId/products/:productId/sarqyts', checkAuth, checkIsUserRoleSeller, checkIsUserShopOwner, getSellerProductSarqyts)

sellerRouter.post('/seller/:shopId/products', checkAuth, checkIsUserRoleSeller, checkIsUserShopOwner, uploadImage.single('image'), createProduct);
sellerRouter.post('/seller/:shopId/products/sarqyt', checkAuth, checkIsUserRoleSeller, checkIsUserShopOwner, createSarqyt);