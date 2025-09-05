import { db } from "../db.js";

export const acceptOrder = async (req,res) => {
  try {
    
    const {id, pickup_code} = req.body;
    const order = await db.query("SELECT id, pickup_code FROM orders WHERE id = $1", []);

    if (order.rows[0].length <= 0) {
      return res.status(404).json({
        message: "Order doesn't exist"
      })
    }

   
    
    await db.query("UPDATE orders SET status = 'confirmed' WHERE id = $1", [id]);
    res.status(200).json({
      message: "Succesfully updated"
    })
  } catch (error) {
    console.error('Error at acceptOrder:', error);
    res.status(500).json({ message: error.message });
  }
}