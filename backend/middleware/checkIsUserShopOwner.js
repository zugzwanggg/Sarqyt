import { db } from "../db.js";

export const checkIsUserShopOwner = async (req,res, next) => {
  try {

    const {id} = req.user;
    const {shopId} = req.params;

    const shops = await db.query("SELECT user_id FROM shops WHERE id = $1 AND user_id = $2", [shopId, id]);
    if (shops.rows.length <= 0) {
      return res.status(403).json({
        message: "Not allowed"
      })
    }

    next();

  } catch (error) {
    console.log('Error at checkIsUserShopOwner:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}