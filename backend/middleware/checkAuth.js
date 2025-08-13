import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "best_secret_2025";

export const checkAuth = async (req,res, next) => {
  try {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;
    next();
}   catch (error) {
    console.log('Error at checkAuth:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}