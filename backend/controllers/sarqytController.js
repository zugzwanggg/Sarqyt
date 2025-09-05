import { db } from "../db.js";
import bcryptjs, { hash } from "bcryptjs";

const getUserCity = async (userId) => {
  const res = await db.query("SELECT city FROM users WHERE id = $1", [userId]);
  return res.rows[0]?.city;
};

// ------------------ GET PICKUPS BY USER'S CITY ------------------
export const getSarqytsByUsersCity = async (req, res) => {
  try {
    const { id } = req.user;
    const { categories = "" } = req.query;
    const city = await getUserCity(id);

    if (!city) {
      return res.status(400).json({ message: "User city not found" });
    }

    const categoriesArr = categories
      ? (Array.isArray(categories) ? categories : categories.split(",").map(Number))
      : [];

    let query = `
      SELECT 
        s.id,
        pt.title AS product_title,
        s.description AS sarqyt_description,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        s.image_url AS product_image,
        sh.id AS shop_id,
        sh.image_url AS logo,
        sh.name AS shop,
        sh.address,
        s.rate,
        s.available_until,
        s.created_at,
        CASE WHEN f.product_type_id IS NOT NULL THEN true ELSE false END AS "isFavorite",
        CASE
          WHEN s.available_until < NOW() THEN 'expired'
          WHEN s.quantity_available = 0 THEN 'sold_out'
          ELSE 'active'
        END AS status
      FROM sarqyts s
      JOIN product_types pt ON pt.id = s.product_type_id
      JOIN shops sh ON sh.id = pt.shop_id
      LEFT JOIN favorites f ON f.product_type_id = pt.id AND f.user_id = $2
      LEFT JOIN product_type_category ptc ON ptc.product_type_id = pt.id
      WHERE sh.city = $1 AND s.available_until > NOW()
    `;

    const params = [city, id];

    if (categoriesArr.length > 0) {
      query += ` AND ptc.category_id = ANY($3::int[]) `;
      params.push(categoriesArr);
    }

    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error at getSarqytsByUsersCity:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ GET NEWEST PICKUPS ------------------
export const getNewestSarqyts = async (req, res) => {
  try {
    const { id } = req.user;
    const { limit = 5, categories = "" } = req.query;
    const city = await getUserCity(id);

    if (!city) {
      return res.status(400).json({ message: "User city not found" });
    }

    const categoriesArr = categories
      ? (Array.isArray(categories) ? categories : categories.split(",").map(Number))
      : [];

    let query = `
      SELECT 
        s.id,
        pt.title AS product_title,
        s.description AS sarqyt_description,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        s.image_url AS product_image,
        sh.id AS shop_id,
        sh.image_url AS logo,
        sh.name AS shop,
        sh.address,
        s.rate,
        s.available_until,
        s.created_at,
        CASE WHEN f.product_type_id IS NOT NULL THEN true ELSE false END AS "isFavorite",
        CASE
          WHEN s.available_until < NOW() THEN 'expired'
          WHEN s.quantity_available = 0 THEN 'sold_out'
          ELSE 'active'
        END AS status
      FROM sarqyts s
      JOIN product_types pt ON pt.id = s.product_type_id
      JOIN shops sh ON sh.id = pt.shop_id
      LEFT JOIN favorites f ON f.product_type_id = pt.id AND f.user_id = $2
      LEFT JOIN product_type_category ptc ON ptc.product_type_id = pt.id
      WHERE sh.city = $1 AND s.available_until > NOW()
    `;

    const params = [city, id];

    if (categoriesArr.length > 0) {
      query += ` AND ptc.category_id = ANY($3::int[]) `;
      params.push(categoriesArr);
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error at getNewestSarqyts:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ GET PICKUP BY ID ------------------
export const getSarqytById = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    const sarqyt = await db.query(`
      SELECT 
        s.id,
        pt.title AS product_title,
        s.description AS sarqyt_description,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        s.image_url AS product_image,
        sh.id AS shop_id,
        sh.image_url AS shop_img,
        sh.address,
        sh.name AS shop_name,
        s.rate,
        s.available_until,
        s.created_at,
        CASE WHEN f.product_type_id IS NOT NULL THEN true ELSE false END AS "isFavorite",
        CASE WHEN o.sarqyt_id IS NOT NULL THEN true ELSE false END AS "isReserved",
        CASE
          WHEN s.available_until < NOW() THEN 'expired'
          WHEN s.quantity_available = 0 THEN 'sold_out'
          ELSE 'active'
        END AS status,
        (
          SELECT json_agg(c.name)
          FROM product_type_category ptc
          JOIN categories c ON c.id = ptc.category_id
          WHERE ptc.product_type_id = pt.id
        ) AS categories
      FROM sarqyts s
      JOIN product_types pt ON pt.id = s.product_type_id
      JOIN shops sh ON sh.id = pt.shop_id
      LEFT JOIN favorites f ON f.product_type_id = pt.id AND f.user_id = $2
      LEFT JOIN orders o ON o.sarqyt_id = s.id AND o.user_id = $2 AND o.status NOT IN ('canceled')
      WHERE s.id = $1
    `, [id, userId]);

    if (!sarqyt.rows.length) return res.status(404).json({ message: "Pickup doesn't exist" });

    res.status(200).json(sarqyt.rows[0]);
  } catch (error) {
    console.error('Error at getSarqytById:', error);
    res.status(500).json({ message: error.message });
  }
};

export const addSarqytToFavorites = async (req, res) => {
  try {
    const { id } = req.user;
    const { sarqytId } = req.body;

    const sarqytRes = await db.query(
      "SELECT product_type_id FROM sarqyts WHERE id = $1",
      [sarqytId]
    );
    
    if (!sarqytRes.rows.length) return res.status(404).json({ message: "Pickup doesn't exist" });

    const productTypeId = sarqytRes.rows[0].product_type_id;

    await db.query(
      "INSERT INTO favorites (user_id, product_type_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [id, productTypeId]
    );
    
    res.status(200).json({ message: "Successfully added to favorites" });
  } catch (error) {
    console.error('Error at addSarqytToFavorites:', error);
    res.status(500).json({ message: error.message });
  }
};

export const removeSarqytFromFavorites = async (req, res) => {
  try {
    const { id } = req.user;
    const { sarqytId } = req.params;

    const sarqytRes = await db.query(
      "SELECT product_type_id FROM sarqyts WHERE id = $1",
      [sarqytId]
    );
    
    if (!sarqytRes.rows.length) return res.status(404).json({ message: "Pickup doesn't exist" });

    const productTypeId = sarqytRes.rows[0].product_type_id;

    await db.query(
      "DELETE FROM favorites WHERE user_id = $1 AND product_type_id = $2",
      [id, productTypeId]
    );
    
    res.status(200).json({ message: "Successfully removed from favorites" });
  } catch (error) {
    console.error('Error at removeSarqytFromFavorites:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ CATEGORIES ------------------
export const getSarqytCategories = async (req, res) => {
  try {
    const categories = await db.query("SELECT id, name FROM categories ORDER BY name");
    res.status(200).json(categories.rows);
  } catch (error) {
    console.error('Error at getSarqytCategories:', error);
    res.status(500).json({ message: error.message });
  }
};

export const reserveSarqyt = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { sarqyt_id, shop_id, quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Invalid quantity" });
    }

    const sarqytRes = await db.query(
      `SELECT discounted_price, quantity_available 
       FROM sarqyts 
       WHERE id = $1`,
      [sarqyt_id]
    );

    if (sarqytRes.rows.length === 0) {
      return res.status(404).json({ error: "Sarqyt not found" });
    }

    const sarqyt = sarqytRes.rows[0];

    if (sarqyt.quantity_available < quantity) {
      return res.status(400).json({ error: `Only ${sarqyt.quantity_available} left` });
    }

    const totalPrice = sarqyt.discounted_price * quantity;
    const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const salt = await bcryptjs.genSalt();
    const hashPickupCode = await bcryptjs.hash(pickupCode, salt);

    const orderRes = await db.query(
      `INSERT INTO orders 
        (user_id, sarqyt_id, shop_id, quantity, total_price, pickup_code, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'reserved') 
       RETURNING *`,
      [user_id, sarqyt_id, shop_id, quantity, totalPrice, hashPickupCode]
    );

    await db.query(
      `UPDATE sarqyts 
       SET quantity_available = quantity_available - $1 
       WHERE id = $2`,
      [quantity, sarqyt_id]
    );

    res.json({ success: true, order: orderRes.rows[0] });
  } catch (err) {
    console.error("Error at reserveOrder", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { order_id } = req.body;

    const orderRes = await db.query(
      `SELECT sarqyt_id, quantity, status 
       FROM orders 
       WHERE id = $1 AND user_id = $2`,
      [order_id, user_id]
    );

    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRes.rows[0];

    if (order.status !== "reserved") {
      return res.status(400).json({ error: "Order cannot be canceled" });
    }

    await db.query(
      `UPDATE orders 
       SET status = 'canceled', updated_at = NOW() 
       WHERE id = $1`,
      [order_id]
    );

    await db.query(
      `UPDATE sarqyts 
       SET quantity_available = quantity_available + $1 
       WHERE id = $2`,
      [order.quantity, order.sarqyt_id]
    );

    res.json({ success: true, message: "Reservation canceled" });
  } catch (err) {
    console.error("Error at cancelReservation", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
