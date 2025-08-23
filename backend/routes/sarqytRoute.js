import { Router } from "express";
import { checkAuth } from "../middleware/checkAuth.js";
import { addSarqytToFavorites, cancelReservation, getSarqytById, getSarqytCategories, getSarqytsByUsersCity, removeSarqytFromFavorites, reserveSarqyt } from "../controllers/sarqytController.js";
import { checkIsUserShopOwner } from "../middleware/checkIsUserShopOwner.js";
export const sarqytRoute = Router();

sarqytRoute.get('/sarqyts', checkAuth, getSarqytsByUsersCity),
sarqytRoute.get('/sarqyts/:id', checkAuth, getSarqytById);
sarqytRoute.post('/favorites/', checkAuth, addSarqytToFavorites);
sarqytRoute.delete('/favorites/:sarqytId', checkAuth, removeSarqytFromFavorites);
sarqytRoute.get('/categories', getSarqytCategories);
sarqytRoute.post('/shops/:shopId/sarqyts/', checkAuth, checkIsUserShopOwner);

sarqytRoute.post('/reserve', checkAuth, reserveSarqyt);
sarqytRoute.patch('/reserve', checkAuth, cancelReservation);