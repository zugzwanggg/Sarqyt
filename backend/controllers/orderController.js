import { db } from "../db.js";

// ------------------ GET USER ORDERS ------------------
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
        s.description AS sarqyt_description,
        s.discounted_price,
        s.original_price,
        s.pickup_start,
        s.pickup_end,
        s.image_url AS sarqyt_image,

        pt.id AS product_type_id,
        pt.title AS product_title,

        sh.id AS shop_id,
        sh.name AS shop_name,
        sh.image_url AS shop_image,
        sh.address AS shop_address
      FROM orders o
      JOIN sarqyts s ON o.sarqyt_id = s.id
      JOIN product_types pt ON s.product_type_id = pt.id
      JOIN shops sh ON pt.shop_id = sh.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
      `,
      [id]
    );

    res.status(200).json(orders.rows);
  } catch (error) {
    console.log("Error at getUserOrders:", error.message + "\n" + error.stack);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ GET ORDER BY ID ------------------
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
        s.description AS sarqyt_description,
        s.discounted_price,
        s.original_price,
        s.pickup_start,
        s.pickup_end,
        s.image_url AS sarqyt_image,

        pt.id AS product_type_id,
        pt.title AS product_title,

        sh.id AS shop_id,
        sh.name AS shop_name,
        sh.image_url AS shop_image,
        sh.address AS shop_address
      FROM orders o
      JOIN sarqyts s ON o.sarqyt_id = s.id
      JOIN product_types pt ON s.product_type_id = pt.id
      JOIN shops sh ON pt.shop_id = sh.id
      WHERE o.id = $1 AND o.user_id = $2
      `,
      [id, userId]
    );

    if (!orderRes.rows.length) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.status(200).json(orderRes.rows[0]);
  } catch (err) {
    console.error("Error at getOrderById", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
