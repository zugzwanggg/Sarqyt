import { sendTelegramMessage } from "../bot/telegramBot.js";
import { db } from "../db.js";
import bcryptjs from "bcryptjs";

const getUserCity = async (userId) => {
  const res = await db.query("SELECT city FROM users WHERE id = $1", [userId]);
  return res.rows[0]?.city;
};

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
      SELECT DISTINCT ON (pt.id)
        s.id,
        pt.title AS product_title,
        pt.description AS sarqyt_description,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        pt.image_url AS product_image,
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
      WHERE sh.city = $1
    `;

    const params = [city, id];

    if (categoriesArr.length > 0) {
      query += ` AND ptc.category_id = ANY($3::int[]) `;
      params.push(categoriesArr);
    }

    query += `
      ORDER BY pt.id, 
      CASE 
        WHEN s.available_until >= NOW() AND s.quantity_available > 0 THEN 1
        WHEN s.available_until >= NOW() AND s.quantity_available = 0 THEN 2
        ELSE 3
      END,
      s.created_at DESC
    `;

    const result = await db.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error at getSarqytsByUsersCity:", error);
    res.status(500).json({ message: error.message });
  }
};

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
      SELECT DISTINCT ON (pt.id)
        s.id,
        pt.title AS product_title,
        pt.description AS sarqyt_description,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        pt.image_url AS product_image,
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
      WHERE sh.city = $1
    `;

    const params = [city, id];

    if (categoriesArr.length > 0) {
      query += ` AND ptc.category_id = ANY($3::int[]) `;
      params.push(categoriesArr);
    }

    query += `
      ORDER BY pt.id, s.created_at DESC
      LIMIT $${params.length + 1}
    `;
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

    const sarqyt = await db.query(
      `
      SELECT 
        s.id,
        pt.title AS product_title,
        pt.description AS sarqyt_description,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        pt.image_url AS product_image,
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
      LEFT JOIN favorites f 
        ON f.product_type_id = pt.id AND f.user_id = $2
      LEFT JOIN orders o 
        ON o.sarqyt_id = s.id 
        AND o.user_id = $2 
        AND o.status IN ('reserved') 
      WHERE s.id = $1
      `,
      [id, userId]
    );

    if (!sarqyt.rows.length) {
      return res.status(404).json({ message: "Pickup doesn't exist" });
    }

    res.status(200).json(sarqyt.rows[0]);
  } catch (error) {
    console.error("Error at getSarqytById:", error);
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
  const client = await db.connect();
  try {
    const { id: user_id } = req.user;
    const { sarqyt_id, shop_id, quantity } = req.body;

    if (!sarqyt_id || !shop_id || !quantity || quantity < 1) {
      return res.status(400).json({ error: "Invalid input" });
    }

    await client.query("BEGIN");

    const sarqytRes = await client.query(
      `SELECT id, discounted_price, quantity_available, shop_id, product_type_id 
       FROM sarqyts 
       WHERE id = $1 FOR UPDATE`,
      [sarqyt_id]
    );

    if (sarqytRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Sarqyt not found" });
    }

    const sarqyt = sarqytRes.rows[0];

    if (sarqyt.shop_id !== shop_id) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Invalid shop for this sarqyt" });
    }

    if (sarqyt.quantity_available < quantity) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: `Only ${sarqyt.quantity_available} left` });
    }

    const existing = await client.query(
      `SELECT id FROM orders 
       WHERE user_id = $1 AND sarqyt_id = $2 AND status = 'reserved'`,
      [user_id, sarqyt_id]
    );

    if (existing.rows.length > 0) {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "You already reserved this sarqyt" });
    }

    const totalPrice = sarqyt.discounted_price * quantity;
    const pickupCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const salt = await bcryptjs.genSalt();
    const hashPickupCode = await bcryptjs.hash(pickupCode, salt);

    const orderRes = await client.query(
      `INSERT INTO orders 
        (user_id, sarqyt_id, shop_id, quantity, total_price, pickup_code, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'reserved') 
       RETURNING id, sarqyt_id, shop_id, quantity, total_price, status, created_at`,
      [user_id, sarqyt_id, shop_id, quantity, totalPrice, hashPickupCode]
    );

    await client.query(
      `UPDATE sarqyts 
       SET quantity_available = quantity_available - $1 
       WHERE id = $2`,
      [quantity, sarqyt_id]
    );

    await client.query("COMMIT");

    const sellerRes = await db.query(
      `SELECT u.telegram_id, u.username, pt.title 
       FROM shops sh
       JOIN users u ON u.id = sh.user_id
       JOIN product_types pt ON pt.id = $2
       WHERE sh.id = $1`,
      [shop_id, sarqyt.product_type_id]
    );

    const sellerTelegramId = sellerRes.rows[0]?.telegram_id;
    const productTitle = sellerRes.rows[0]?.title;
    const username = sellerRes.rows[0]?.username;

    await sendTelegramMessage(
      sellerTelegramId,
      `🛒 <b>Новый заказ!</b>\n\n` +
      `📦 Товар: <b>${productTitle}</b>\n` +
      `🔢 Кол-во: <b>${quantity}</b>\n` +
      `💰 Сумма: <b>${totalPrice}₸</b>\n` +
      `👤 Пользователь: <b><a href="https://t.me/${username}">@${username}</a></b>`
    );

    res.json({ 
      success: true, 
      order: orderRes.rows[0], 
      pickup_code: pickupCode 
    });

  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error at reserveSarqyt", err);
    res.status(500).json({ error: "Something went wrong" });
  } finally {
    client.release();
  }
};

export const cancelReservation = async (req, res) => {
  const client = await db.connect();
  try {
    const { id: user_id } = req.user;
    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({ error: "Order ID required" });
    }

    await client.query("BEGIN");

    const orderRes = await client.query(
      `SELECT id, sarqyt_id, quantity, status, shop_id 
       FROM orders 
       WHERE id = $1 AND user_id = $2 FOR UPDATE`,
      [order_id, user_id]
    );

    if (orderRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderRes.rows[0];

    if (order.status !== "reserved") {
      await client.query("ROLLBACK");
      return res.status(400).json({ error: "Order cannot be canceled" });
    }

    await client.query(
      `UPDATE orders 
       SET status = 'canceled', updated_at = NOW() 
       WHERE id = $1`,
      [order_id]
    );

    await client.query(
      `UPDATE sarqyts 
       SET quantity_available = quantity_available + $1 
       WHERE id = $2`,
      [order.quantity, order.sarqyt_id]
    );

    await client.query("COMMIT");

    const buyerRes = await client.query(
      `SELECT username FROM users WHERE id = $1`,
      [user_id]
    );
    const username = buyerRes.rows[0]?.username;

    const sellerRes = await client.query(
      `SELECT u.telegram_id 
       FROM shops sh
       JOIN users u ON sh.user_id = u.id
       WHERE sh.id = $1`,
      [order.shop_id]
    );
    const productTitle = sellerRes.rows[0]?.title;
    const sellerTelegramId = sellerRes.rows[0]?.telegram_id;

    if (sellerTelegramId) {
      await sendTelegramMessage(sellerTelegramId, 
        `🛒 <b>❌ Заказ отменен</b>\n\n` +
      `📦 Товар: <b>${productTitle}</b>\n` +
      `🔢 Кол-во: <b>${order.quantity}</b>\n` +
      `👤 Пользователь: <b><a href="https://t.me/${username}">@${username}</a></b>`);
    }

    res.json({ success: true, message: "Reservation canceled" });

  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Error at cancelReservation", err);
    res.status(500).json({ error: "Something went wrong" });
  } finally {
    client.release();
  }
};