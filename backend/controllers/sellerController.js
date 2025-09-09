import { db } from "../db.js";

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
      `
      SELECT o.id, o.shop_id, o.status, s.pickup_start, s.pickup_end
      FROM orders o
      JOIN sarqyts s ON s.id = o.sarqyt_id
      WHERE o.id = $1
      `,
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
      return res.status(400).json({ message: "Order id required" });
    }

    const shop = await db.query("SELECT id FROM shops WHERE user_id = $1", [userId]);
    if (shop.rowCount === 0) {
      return res.status(403).json({ message: "You do not own a shop" });
    }

    const orderRes = await db.query(
      `
      SELECT o.id, o.shop_id, o.status, s.pickup_start, s.pickup_end
      FROM orders o
      JOIN sarqyts s ON s.id = o.sarqyt_id
      WHERE o.id = $1
      `,
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

export const getSellerShopData = async (req,res) => {
  try {

    const {id:user_id} = req.user;

    const data = await db.query("SELECT * FROM shops WHERE user_id = $1", [user_id]);

    if (data.rows[0].length <= 0) {
      return res.status(404).json({
        message: "Data not found"
      })
    }

    res.status(200).json(data.rows[0])
    
  } catch (error) {
    console.error("Error at getSellerShopData:", error);
    res.status(500).json({ message: error.message });
  }
}

export const getDashboardData = async (req, res) => {
  try {
    const { filter } = req.query;
    const { shopId } = req.params; 
    const validFilters = ["year", "month", "week", "day"];

    const chosenFilter = validFilters.includes(filter) ? filter : null;

    const query = `
      WITH filtered_orders AS (
        SELECT *
        FROM orders
        WHERE shop_id = $2
          AND (
            CASE WHEN $1 = 'year' THEN date_trunc('year', created_at) = date_trunc('year', now())
                 WHEN $1 = 'month' THEN date_trunc('month', created_at) = date_trunc('month', now())
                 WHEN $1 = 'week' THEN date_trunc('week', created_at) = date_trunc('week', now())
                 WHEN $1 = 'day' THEN date_trunc('day', created_at) = date_trunc('day', now())
                 ELSE true END
          )
      ),
      filtered_sarqyts AS (
        SELECT s.*
        FROM sarqyts s
        JOIN product_types pt ON s.product_type_id = pt.id
        WHERE pt.shop_id = $2
          AND s.available_until >= now()
      )
      SELECT 
        COALESCE(SUM(CASE WHEN status = 'completed' THEN total_price END), 0) AS total_earnings,
        (SELECT COUNT(*) FROM filtered_sarqyts) AS active_products,
        COALESCE(COUNT(CASE WHEN status = 'reserved' THEN 1 END), 0) AS pending_orders,
        COALESCE(COUNT(CASE WHEN status = 'completed' THEN 1 END), 0) AS completed_orders
      FROM filtered_orders;
    `;

    const { rows } = await db.query(query, [chosenFilter, shopId]);
    res.json(rows[0]);

  } catch (error) {
   console.error("Error at getDashboardData:", error);
    res.status(500).json({ message: error.message });
  }
};


export const getRecentOrders = async (req, res) => {
  try {
    const { shopId } = req.params;
    let { filter = "day", status = null, limit = 20 } = req.query;

    const validFilters = ["day", "week"];
    const chosenFilter = validFilters.includes(filter) ? filter : "day";

    if (status === "null" || status === "" || status === undefined) {
      status = null;
    }

    const query = `
      SELECT 
        o.id,
        pt.title AS sarqyt_title,
        pt.image_url AS sarqyt_image,
        o.user_id,
        u.username,
        o.sarqyt_id,
        s.id AS shop_id,
        s.name AS shop_name,
        s.address AS shop_address,
        sarqyts.discounted_price,
        o.quantity,
        o.total_price,
        o.status,
        o.payment_method,
        o.payment_status,
        o.pickup_code,
        o.pickup_time,
        o.created_at
      FROM orders o 
      JOIN sarqyts ON o.sarqyt_id = sarqyts.id
      JOIN product_types pt ON sarqyts.product_type_id = pt.id
      JOIN users u ON o.user_id = u.id
      JOIN shops s ON o.shop_id = s.id
      WHERE o.shop_id = $1
        AND (
          CASE 
            WHEN $2 = 'day' THEN date_trunc('day', o.created_at) = date_trunc('day', now())
            WHEN $2 = 'week' THEN date_trunc('week', o.created_at) = date_trunc('week', now())
            ELSE date_trunc('day', o.created_at) = date_trunc('day', now())
          END
        )
        AND ($3::text IS NULL OR o.status = $3)
      ORDER BY o.created_at DESC
      LIMIT $4;
    `;

    const { rows } = await db.query(query, [shopId, chosenFilter, status, limit]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error at getRecentOrders:", error);
    res.status(500).json({ message: error.message });
  }
};
