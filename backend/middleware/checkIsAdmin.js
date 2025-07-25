import { db } from "../db.js";

export const checkIsAdmin = async (req,res, next) => {
  try {

    const {id} = req.user;

    const admin = await db.query("SELECT role FROM users WHERE id = $1", [id]);
    if (admin.rows[0].role !== 'admin') {
      return res.status(403).json({
        message: "Not allowed"
      })
    };

    next();

  } catch (error) {
    console.log('Error at checkIsAdmin:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}