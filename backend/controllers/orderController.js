import { db } from "../db.js";

export const getUserOrders = async (req, res) => {
  try {
    const { id } = req.user;

    const orders = await db.query(
      `
      SELECT 
        o.id,
        o.quantity,
        o.total_price,
        o.status,
        o.payment_method,
        o.payment_status,
        o.pickup_code,
        o.pickup_time,
        o.created_at,
        o.updated_at,

        s.id AS sarqyt_id,
        s.title AS sarqyt_title,
        s.image_url AS sarqyt_image,
        s.discounted_price,
        s.original_price,

        sh.id AS shop_id,
        sh.name AS shop_name,
        sh.image_url AS shop_image,
        sh.address AS shop_address
      FROM orders o
      JOIN sarqyts s ON o.sarqyt_id = s.id
      JOIN shops sh ON o.shop_id = sh.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
      `,
      [id]
    );

    res.status(200).json(orders.rows);
  } catch (error) {
    console.log("Error at getUserOrders:", error.message + "\n" + error.stack);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const orderRes = await db.query(
      `
      SELECT 
        o.id,
        o.quantity,
        o.total_price,
        o.status,
        o.payment_method,
        o.payment_status,
        o.pickup_code,
        o.pickup_time,
        o.created_at,
        o.updated_at,

        s.id AS sarqyt_id,
        s.title AS sarqyt_title,
        s.image_url AS sarqyt_image,
        s.discounted_price,
        s.original_price,

        sh.id AS shop_id,
        sh.name AS shop_name,
        sh.image_url AS shop_image,
        sh.address AS shop_address
      FROM orders o
      JOIN sarqyts s ON o.sarqyt_id = s.id
      JOIN shops sh ON o.shop_id = sh.id
      WHERE o.id = $1 AND o.user_id = $2
      `,
      [id, userId]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(orderRes.rows[0]);
  } catch (err) {
    console.error(`Error at getOrderById`, err);
    res.status(500).json({ error: "Something went wrong" });
  }
};