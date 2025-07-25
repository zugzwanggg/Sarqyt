import { db } from "../db.js";


export const checkIsUserRoleSeller = async (req,res,next) => {
  try {

    const {id} = req.user;

    const user = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    if (user.rows[0].role !== 'seller') {
      return res.status(403).json({
        message: "User is not seller"
      })
    }
    
    next()
    
  } catch (error) {
    console.log('Error at checkIsUserRoleSeller:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}