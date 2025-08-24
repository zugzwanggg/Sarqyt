import { db } from "../db.js";


const getUserCity = async (userId) => {
  const res = await db.query("SELECT city FROM users WHERE id = $1", [userId]);
  return res.rows[0]?.city;
};

export const getSarqytsByUsersCity = async (req, res) => {
  try {
    const { id } = req.user;
    const { categories = "" } = req.query;

    const city = await getUserCity(id);

    const categoriesArr = categories
      ? (Array.isArray(categories) ? categories : categories.split(",").map(Number))
      : [];

    let query = `
      SELECT 
        s.id,
        s.title,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        s.image_url,
        sh.id AS shop_id,
        sh.image_url AS logo,
        sh.name AS shop,
        CASE WHEN f.sarqyt_id IS NOT NULL THEN true ELSE false END AS "isFavorite"
      FROM sarqyts s
      JOIN shops sh ON sh.id = s.shop_id
      LEFT JOIN favorites f ON f.sarqyt_id = s.id AND f.user_id = $2
      LEFT JOIN sarqyt_category sc ON sc.sarqyt_id = s.id
      WHERE sh.city = $1
    `;

    const params = [city, id];

    if (categoriesArr.length > 0) {
      query += ` AND sc.category_id = ANY($3::int[]) `;
      params.push(categoriesArr);
    }

    const result = await db.query(query, params);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error at getSarqytsByUsersCity:", error.message, error.stack);
    res.status(500).json({ message: error.message });
  }
};

export const getNewestSarqyts = async (req, res) => {
  try {
    const { id } = req.user;
    const { limit = 5, categories = "" } = req.query;

    const city = await getUserCity(id);

    const categoriesArr = categories
      ? (Array.isArray(categories) ? categories : categories.split(",").map(Number))
      : [];

    let query = `
      SELECT 
        s.id,
        s.title,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        s.image_url,
        sh.id AS shop_id,
        sh.image_url AS logo,
        sh.name AS shop,
        CASE WHEN f.sarqyt_id IS NOT NULL THEN true ELSE false END AS "isFavorite"
      FROM sarqyts s
      JOIN shops sh ON sh.id = s.shop_id
      LEFT JOIN favorites f ON f.sarqyt_id = s.id AND f.user_id = $2
      LEFT JOIN sarqyt_category sc ON sc.sarqyt_id = s.id
      WHERE sh.city = $1 
        AND s.pickup_end > NOW()
    `;

    const params = [city, id];

    if (categoriesArr.length > 0) {
      query += ` AND sc.category_id = ANY($3::int[]) `;
      params.push(categoriesArr);
    }

    query += ` ORDER BY s.created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await db.query(query, params);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error at getNewestSarqyts:", error.message, error.stack);
    res.status(500).json({ message: error.message });
  }
};

export const getSarqytById = async (req,res) => {
  try {
    const {id:userId} = req.user;
    const {id} = req.params;

    const sarqyt = await db.query(`
      SELECT 
        s.id,
        s.shop_id,
        s.title,
        s.description,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        s.image_url,
        shops.image_url AS shop_img,
        shops.address,
        s.created_at,
        CASE WHEN favorites.sarqyt_id IS NOT NULL THEN true ELSE false END AS "isFavorite",
        CASE WHEN orders.sarqyt_id IS NOT NULL THEN true ELSE false END As "isReserved",
        (
          SELECT json_agg(c.name)
          FROM sarqyt_category sc
          JOIN categories c ON c.id = sc.category_id
          WHERE sc.sarqyt_id = s.id
        ) AS categories
    FROM sarqyts s
    LEFT JOIN shops ON s.shop_id = shops.id
    LEFT JOIN favorites ON favorites.sarqyt_id = s.id AND favorites.user_id = $2
    LEFT JOIN orders 
      ON orders.sarqyt_id = s.id 
      AND orders.user_id = $2
      AND orders.status NOT IN ('canceled')
    WHERE s.id = $1;
    `, [id, userId]);

    if (sarqyt.rows.length <= 0) {
      return res.status(404).json({
        message: "Sarqyt doesn't exist"
      })
    }

    res.status(200).json(sarqyt.rows[0]);
  } catch (error) {
    console.log('Error at getSarqytById:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}


// Favorites

export const addSarqytToFavorites = async (req,res) => {
  try {

    const {id} = req.user;
    const {sarqytId} = req.body;
    
    const sarqyt = await db.query("SELECT 1 FROM sarqyts WHERE id = $1", [sarqytId]);
    if (sarqyt.rows.length <= 0) {
      return res.status(404).json({
        message: "Sarqyt doesn't exist"
      })
    }

    await db.query("INSERT INTO favorites (user_id, sarqyt_id) VALUES ($1,$2)", [id, sarqytId]);

    res.status(200).json({
      message: "Succesfully added to favorites"
    })
    
  } catch (error) {
    console.log('Error at addSarqytToFavorites:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}

export const removeSarqytFromFavorites = async (req,res) => {
  try {
    const {id} = req.user;
    const {sarqytId} = req.params;
    
    const sarqyt = await db.query("SELECT 1 FROM sarqyts WHERE id = $1", [sarqytId]);
    if (sarqyt.rows.length <= 0) {
      return res.status(404).json({
        message: "Sarqyt doesn't exist"
      })
    }

    await db.query("DELETE FROM favorites WHERE user_id = $1 AND sarqyt_id = $2", [id, sarqytId])
    res.status(200).json({
      message: "Succesfully removed from favorites"
    })
  } catch (error) {
    console.log('Error at removeSarqytFromFavorites:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}

export const getSarqytCategories = async (req,res) => {
  try {
    
    const categories = await db.query("SELECT * FROM categories");
    res.status(200).json(categories.rows);
    
  } catch (error) {
    console.log('Error at getSarqytCategories:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}

export const reserveSarqyt = async (req, res) => {
  try {
    const {id:user_id} = req.user;
    const {sarqyt_id, shop_id, quantity } = req.body;

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

    const orderRes = await db.query(
      `INSERT INTO orders 
        (user_id, sarqyt_id, shop_id, quantity, total_price, pickup_code, status) 
       VALUES ($1, $2, $3, $4, $5, $6, 'reserved') 
       RETURNING *`,
      [user_id, sarqyt_id, shop_id, quantity, totalPrice, pickupCode]
    );

    await db.query(
      `UPDATE sarqyts 
       SET quantity_available = quantity_available - $1
       WHERE id = $2`,
      [quantity, sarqyt_id]
    );

    res.json({ success: true, order: orderRes.rows[0] });
  } catch (err) {
    console.error('Error at reserveOrder',err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const cancelReservation = async (req, res) => {
  try {
    const {id:user_id} = req.user;
    const { order_id} = req.body;
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
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};