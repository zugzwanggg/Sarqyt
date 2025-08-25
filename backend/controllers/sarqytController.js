import { db } from "../db.js";

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

    const categoriesArr = categories
      ? (Array.isArray(categories) ? categories : categories.split(",").map(Number))
      : [];

    let query = `
      SELECT 
        s.id AS pickup_id,
        pt.id AS product_type_id,
        pt.title,
        s.description,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        s.image_url,
        sh.id AS shop_id,
        sh.image_url AS logo,
        sh.name AS shop,
        CASE WHEN f.sarqyt_id IS NOT NULL THEN true ELSE false END AS "isFavorite",
        CASE
          WHEN s.available_until < NOW() THEN 'expired'
          WHEN s.quantity_available = 0 THEN 'sold_out'
          ELSE 'active'
        END AS status
      FROM sarqyts s
      JOIN product_types pt ON pt.id = s.product_type_id
      JOIN shops sh ON sh.id = pt.shop_id
      LEFT JOIN favorites f ON f.sarqyt_id = s.id AND f.user_id = $2
      LEFT JOIN product_type_category ptc ON ptc.product_type_id = pt.id
      WHERE sh.city = $1 AND s.available_until > NOW() - INTERVAL '1 day'
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

    const categoriesArr = categories
      ? (Array.isArray(categories) ? categories : categories.split(",").map(Number))
      : [];

    let query = `
      SELECT 
        s.id AS pickup_id,
        pt.id AS product_type_id,
        pt.title,
        s.description,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        s.image_url,
        sh.id AS shop_id,
        sh.image_url AS logo,
        sh.name AS shop,
        CASE WHEN f.sarqyt_id IS NOT NULL THEN true ELSE false END AS "isFavorite",
        CASE
          WHEN s.available_until < NOW() THEN 'expired'
          WHEN s.quantity_available = 0 THEN 'sold_out'
          ELSE 'active'
        END AS status
      FROM sarqyts s
      JOIN product_types pt ON pt.id = s.product_type_id
      JOIN shops sh ON sh.id = pt.shop_id
      LEFT JOIN favorites f ON f.sarqyt_id = s.id AND f.user_id = $2
      LEFT JOIN product_type_category ptc ON ptc.product_type_id = pt.id
      WHERE sh.city = $1 AND s.available_until > NOW() - INTERVAL '1 day'
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
export const getSarqytById = async (req,res) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    const sarqyt = await db.query(`
      SELECT 
        s.id AS pickup_id,
        pt.id AS product_type_id,
        pt.title,
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
        CASE WHEN f.sarqyt_id IS NOT NULL THEN true ELSE false END AS "isFavorite",
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
      LEFT JOIN shops ON pt.shop_id = shops.id
      LEFT JOIN favorites f ON f.sarqyt_id = s.id AND f.user_id = $2
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

// ------------------ FAVORITES ------------------
export const addSarqytToFavorites = async (req,res) => {
  try {
    const { id } = req.user;
    const { sarqytId } = req.body;

    const exists = await db.query("SELECT 1 FROM sarqyts WHERE id = $1", [sarqytId]);
    if (!exists.rows.length) return res.status(404).json({ message: "Pickup doesn't exist" });

    await db.query("INSERT INTO favorites (user_id, sarqyt_id) VALUES ($1,$2)", [id, sarqytId]);
    res.status(200).json({ message: "Successfully added to favorites" });
  } catch (error) {
    console.error('Error at addSarqytToFavorites:', error);
    res.status(500).json({ message: error.message });
  }
};

export const removeSarqytFromFavorites = async (req,res) => {
  try {
    const { id } = req.user;
    const { sarqytId } = req.params;

    const exists = await db.query("SELECT 1 FROM sarqyts WHERE id = $1", [sarqytId]);
    if (!exists.rows.length) return res.status(404).json({ message: "Pickup doesn't exist" });

    await db.query("DELETE FROM favorites WHERE user_id = $1 AND sarqyt_id = $2", [id, sarqytId]);
    res.status(200).json({ message: "Successfully removed from favorites" });
  } catch (error) {
    console.error('Error at removeSarqytFromFavorites:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ CATEGORIES ------------------
export const getSarqytCategories = async (req,res) => {
  try {
    const categories = await db.query("SELECT * FROM categories");
    res.status(200).json(categories.rows);
  } catch (error) {
    console.error('Error at getSarqytCategories:', error);
    res.status(500).json({ message: error.message });
  }
};
