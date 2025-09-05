import { db } from "../db.js";
import bcryptjs from "bcryptjs";

export const acceptOrder = async (req,res) => {
  try {
    
    const {id:orderId} = req.body;
    const {id:userId} = req.user;

    if (!orderId) return res.status(404).json({
      message: "Provide id value"
    })
    const shop = await db.query("SELECT id FROM shops WHERE user_id = $1", [userId]);
    if (shop.rowCount === 0) {
      return res.status(403).json({ message: "You do not own a shop" });
    }

    const checkOrder = await db.query("SELECT shop_id, pickup_code FROM orders WHERE id = $1", [orderId]);
    if (checkOrder.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (checkOrder.rows[0].shop_id !== shop.rows[0].id) {
      return res.status(403).json({ message: "This order does not belong to your shop" });
    }
    
    await db.query("UPDATE orders SET status = 'confirmed' WHERE id = $1", [orderId]);
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

    const {id:orderId} = req.params;
    const {id:userId} = req.user;

    if (!orderId) return res.status(404).json({
      message: "Provide id value"
    })
    const shop = await db.query("SELECT id FROM shops WHERE user_id = $1", [userId]);
    if (shop.rowCount === 0) {
      return res.status(403).json({ message: "You do not own a shop" });
    }

    const checkOrder = await db.query("SELECT shop_id, pickup_code FROM orders WHERE id = $1", [orderId]);
    if (checkOrder.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (checkOrder.rows[0].shop_id !== shop.rows[0].id) {
      return res.status(403).json({ message: "This order does not belong to your shop" });
    }

    const order = await db.query(`
      SELECT 
        o.id AS order_id,
        u.username,
        pt.title AS product_name,
        o.pickup_time,
        o.status,
        sh.name AS shop_name
      FROM orders o
      JOIN users u ON u.id = o.user_id
      JOIN sarqyts s ON s.id = o.sarqyt_id
      JOIN product_types pt ON pt.id = s.product_type_id
      JOIN shops sh ON sh.id = o.shop_id
      WHERE o.id = $1;
    `, [orderId])

    res.status(200).json(order.rows[0]);
    
  } catch (error) {
    console.error('Error at getScanData:', error);
    res.status(500).json({ message: error.message });
  }
}