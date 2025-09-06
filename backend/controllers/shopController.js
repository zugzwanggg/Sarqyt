import { db } from "../db.js";

// ------------------ GET SHOP ------------------
export const getShopById = async (req, res) => {
  try {
    const { id } = req.params;

    const shopResult = await db.query(`
      SELECT 
        s.*,
        c.name AS city_name,
        co.name AS country_name,
        co.code AS country_code,
        COALESCE(AVG(sar.rate), 0) AS rating,
        COUNT(DISTINCT sar.id) AS total_sarqyts
      FROM shops s
      LEFT JOIN cities c ON c.id = s.city
      LEFT JOIN countries co ON co.id = s.country
      LEFT JOIN product_types pt ON pt.shop_id = s.id
      LEFT JOIN sarqyts sar ON sar.product_type_id = pt.id
      WHERE s.id = $1
      GROUP BY s.id, c.name, co.name, co.code
    `, [id]);

    if (!shopResult.rows.length) {
      return res.status(404).json({ message: "Shop doesn't exist." });
    }

    res.status(200).json(shopResult.rows[0]);
  } catch (error) {
    console.error('Error at getShopById:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ GET SHOP PICKUPS ------------------
export const getShopSarqytsById = async (req, res) => {
  try {
    const { shopId } = req.params;

    const checkShop = await db.query("SELECT 1 FROM shops WHERE id = $1", [shopId]);
    if (!checkShop.rows.length) return res.status(404).json({ message: "Shop doesn't exist" });

    const sarqyts = await db.query(`
      SELECT DISTINCT ON (pt.id)
        s.id,
        pt.title AS product_title,
        s.description AS sarqyt_description,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        s.image_url AS product_image,
        s.rate,
        s.available_until,
        s.created_at,
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
      FROM product_types pt
      JOIN sarqyts s ON s.product_type_id = pt.id
      WHERE pt.shop_id = $1
      ORDER BY pt.id, s.created_at DESC
    `, [shopId]);

    res.status(200).json(sarqyts.rows);
  } catch (error) {
    console.error('Error at getShopSarqytsById:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ ADD SHOP ------------------
export const addUserShop = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, image_url, description, address, link, country, city, lat, lng } = req.body;

    if (!name || !description || !address || !country || !city) {
      return res.status(400).json({ message: "Fill all the required fields" });
    }

    // Verify country and city exist
    const countryCheck = await db.query("SELECT 1 FROM countries WHERE id = $1", [country]);
    const cityCheck = await db.query("SELECT 1 FROM cities WHERE id = $1", [city]);

    if (!countryCheck.rows.length || !cityCheck.rows.length) {
      return res.status(400).json({ message: "Invalid country or city" });
    }

    const result = await db.query(`
      INSERT INTO shops (name, image_url, description, address, link, country, city, lat, lng, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [name, image_url, description, address, link, country, city, lat, lng, id]);

    res.status(201).json({ 
      message: "Shop added successfully", 
      shop: result.rows[0] 
    });
  } catch (error) {
    console.error('Error at addUserShop:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ EDIT SHOP ------------------
export const editShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { id: user_id } = req.user;
    const { name, image_url, description, address, link, country, city, lat, lng } = req.body;

    if (!name || !description || !address || !country || !city) {
      return res.status(400).json({ message: "Fill all the required fields" });
    }

    // Check if shop exists and belongs to user
    const shopCheck = await db.query(
      "SELECT 1 FROM shops WHERE id = $1 AND user_id = $2", 
      [shopId, user_id]
    );

    if (!shopCheck.rows.length) {
      return res.status(404).json({ message: "Shop not found or access denied" });
    }

    // Verify country and city exist
    const countryCheck = await db.query("SELECT 1 FROM countries WHERE id = $1", [country]);
    const cityCheck = await db.query("SELECT 1 FROM cities WHERE id = $1", [city]);

    if (!countryCheck.rows.length || !cityCheck.rows.length) {
      return res.status(400).json({ message: "Invalid country or city" });
    }

    const result = await db.query(`
      UPDATE shops 
      SET name = $2, image_url = $3, description = $4, address = $5, 
          link = $6, country = $7, city = $8, lat = $9, lng = $10
      WHERE id = $1 AND user_id = $11
      RETURNING *
    `, [shopId, name, image_url, description, address, link, country, city, lat, lng, user_id]);

    res.status(200).json({ 
      message: "Successfully updated", 
      shop: result.rows[0] 
    });
  } catch (error) {
    console.error('Error at editShop:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ DELETE SHOP ------------------
export const deleteShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { id: user_id } = req.user;

    // Check if shop exists and belongs to user
    const shopCheck = await db.query(
      "SELECT 1 FROM shops WHERE id = $1 AND user_id = $2", 
      [shopId, user_id]
    );

    if (!shopCheck.rows.length) {
      return res.status(404).json({ message: "Shop not found or access denied" });
    }

    await db.query("DELETE FROM shops WHERE id = $1 AND user_id = $2", [shopId, user_id]);

    res.status(200).json({ message: "Shop deleted successfully" });
  } catch (error) {
    console.error('Error at deleteShop:', error);
    res.status(500).json({ message: error.message });
  }
};