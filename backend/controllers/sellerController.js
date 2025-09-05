import { db } from "../db.js";
import bcryptjs from "bcryptjs";

export const acceptOrder = async (req,res) => {
  try {
    
    const {id} = req.body;
    if (!id) return res.status(404).json({
      message: "Provide id value"
    })
    const order = await db.query("SELECT id, pickup_code FROM orders WHERE id = $1", [id]);

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

export const getScanData = async (req,res) => {
  try {

    const {id} = req.params;

    if (!id) return res.status(404).json({
      message: "Provide id value"
    })
    const checkOrder = await db.query("SELECT 1 FROM orders WHERE id = $1", [id]);

    if (checkOrder.rows[0].length <= 0) {
      return res.status(404).json({
        message: "Order doesn't exist"
      })
    }

    const order = await db.query(`
      SELECT 
        o.id AS order_id,
        u.username,
        pt.title AS product_name,
        o.pickup_time,
        o.status
      FROM orders o
      JOIN users u ON u.id = o.user_id
      JOIN sarqyts s ON s.id = o.sarqyt_id
      JOIN product_types pt ON pt.id = s.product_type_id
      WHERE o.id = $1;
    `, [id])

    res.status(200).json(order.rows[0]);
    
  } catch (error) {
    console.error('Error at getScanData:', error);
    res.status(500).json({ message: error.message });
  }
}