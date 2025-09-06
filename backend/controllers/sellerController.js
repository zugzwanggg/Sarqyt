import { db } from "../db.js";
import bcryptjs from "bcryptjs";

export const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { id: userId } = req.user;

    if (!orderId) return res.status(400).json({ message: "Provide order id" });

    const shop = await db.query("SELECT id FROM shops WHERE user_id = $1", [userId]);
    if (shop.rowCount === 0) {
      return res.status(403).json({ message: "You do not own a shop" });
    }

    const orderRes = await db.query(
      `SELECT id, shop_id, status, pickup_start, pickup_end 
       FROM orders WHERE id = $1`,
      [orderId]
    );
    if (orderRes.rowCount === 0) return res.status(404).json({ message: "Order not found" });

    const order = orderRes.rows[0];
    if (order.shop_id !== shop.rows[0].id) {
      return res.status(403).json({ message: "This order does not belong to your shop" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Only pending orders can be confirmed" });
    }

    const now = new Date();
    if (order.pickup_end && now > new Date(order.pickup_end)) {
      return res.status(400).json({ message: "Pickup window has already expired" });
    }

    await db.query(
      "UPDATE orders SET status = 'confirmed', updated_at = NOW() WHERE id = $1",
      [orderId]
    );

    return res.status(200).json({ message: "Order confirmed successfully" });
  } catch (error) {
    console.error("Error at acceptOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const completeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { id: userId } = req.user;

    if (!orderId) {
      return res.status(400).json({ message: "Order id code required" });
    }

    const shop = await db.query("SELECT id FROM shops WHERE user_id = $1", [userId]);
    if (shop.rowCount === 0) {
      return res.status(403).json({ message: "You do not own a shop" });
    }

    const orderRes = await db.query(
      `SELECT id, shop_id, status, pickup_start, pickup_end, pickup_code 
       FROM orders WHERE id = $1`,
      [orderId]
    );
    if (orderRes.rowCount === 0) return res.status(404).json({ message: "Order not found" });

    const order = orderRes.rows[0];
    if (order.shop_id !== shop.rows[0].id) {
      return res.status(403).json({ message: "This order does not belong to your shop" });
    }

    if (order.status !== "confirmed") {
      return res.status(400).json({ message: "Only confirmed orders can be completed" });
    }

    const now = new Date();
    if (order.pickup_start && now < new Date(order.pickup_start)) {
      return res.status(400).json({ message: "Pickup has not started yet" });
    }
    if (order.pickup_end && now > new Date(order.pickup_end)) {
      return res.status(400).json({ message: "Pickup window expired" });
    }

    await db.query(
      "UPDATE orders SET status = 'completed', updated_at = NOW() WHERE id = $1",
      [orderId]
    );

    return res.status(200).json({ message: "Order completed successfully" });
  } catch (error) {
    console.error("Error at completeOrder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getScanData = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { id: userId } = req.user;

    if (!orderId) {
      return res.status(404).json({ message: "Provide id value" });
    }

    const shop = await db.query("SELECT id FROM shops WHERE user_id = $1", [userId]);
    if (shop.rowCount === 0) {
      return res.status(403).json({ message: "You do not own a shop" });
    }


    const checkOrder = await db.query(
      "SELECT shop_id, pickup_code FROM orders WHERE id = $1",
      [orderId]
    );
    if (checkOrder.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }
    if (checkOrder.rows[0].shop_id !== shop.rows[0].id) {
      return res.status(403).json({ message: "This order does not belong to your shop" });
    }

    const order = await db.query(
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
        pt.title AS sarqyt_title,
        pt.image_url AS sarqyt_image,
        s.discounted_price,
        s.original_price,

        sh.id AS shop_id,
        sh.name AS shop_name,
        sh.image_url AS shop_image,
        sh.address AS shop_address,

        u.username,
        u.email
      FROM orders o
      JOIN users u ON u.id = o.user_id
      JOIN sarqyts s ON s.id = o.sarqyt_id
      JOIN product_types pt ON pt.id = s.product_type_id
      JOIN shops sh ON sh.id = o.shop_id
      WHERE o.id = $1;
      `,
      [orderId]
    );

    if (order.rowCount === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order.rows[0]);
  } catch (error) {
    console.error("Error at getScanData:", error);
    res.status(500).json({ message: error.message });
  }
};