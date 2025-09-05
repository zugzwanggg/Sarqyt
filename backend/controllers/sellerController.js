import { db } from "../db.js";



export const acceptOrder = async (req,res) => {
  try {

    

  } catch (error) {
    console.error('Error at acceptOrder:', error);
    res.status(500).json({ message: error.message });
  }
}