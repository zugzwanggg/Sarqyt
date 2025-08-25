import { db } from "../db.js";

// ------------------ USER INFO ------------------
export const getUserInfo = async (req,res) => {
  try {
    const {id} = req.user;
    
    const info = await db.query(`
      SELECT username, email, address, countries.name AS country, cities.name AS city, users.city AS cityId, role
      FROM users 
      JOIN countries ON countries.id = users.country 
      LEFT JOIN cities ON cities.id = users.city 
      WHERE users.id = $1
    `, [id]);

    res.status(200).json(info.rows[0]);

  } catch (error) {
    console.error('Error at getUserInfo:', error);
    res.status(500).json({ message: error.message });
  }
};

export const changeUsername = async (req,res) => {
  try {
    const {id} = req.user;
    const {username} = req.body;

    await db.query("UPDATE users SET username = $1 WHERE id = $2", [username, id]);

    res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.error('Error at changeUsername:', error);
    res.status(500).json({ message: error.message });
  }
};

export const changeUserCountry = async (req,res) => {
  try {
    const {id} = req.user;
    const {countryId} = req.body;

    if (!countryId) return res.status(400).json({ message: "Select country" });

    const checkCountry = await db.query("SELECT 1 FROM countries WHERE id = $1", [countryId]);
    if (!checkCountry.rows.length) return res.status(404).json({ message: "Country doesn't exist" });

    await db.query("UPDATE users SET country = $1 WHERE id = $2", [countryId, id]);
    res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.error('Error at changeUserCountry:', error);
    res.status(500).json({ message: error.message });
  }
};

export const changeUserCity = async (req,res) => {
  try {
    const {id} = req.user;
    const {cityId} = req.body;

    if (!cityId) return res.status(400).json({ message: "Select city" });

    const checkCity = await db.query("SELECT 1 FROM cities WHERE id = $1", [cityId]);
    if (!checkCity.rows.length) return res.status(404).json({ message: "City doesn't exist" });

    await db.query("UPDATE users SET city = $1 WHERE id = $2", [cityId, id]);
    res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.error('Error at changeUserCity:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ FAVORITES ------------------
export const getUserFavorites = async (req, res) => {
  try {
    const { id } = req.user;

    // Query latest active sarqyt (pickup) for each favorite product type
    const favorites = await db.query(`
      SELECT DISTINCT
        s.id AS pickup_id,
        pt.id AS product_type_id,
        pt.title,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        s.image_url,
        sh.id AS shop_id,
        sh.image_url AS logo,
        sh.name AS shop,
        true AS "isFavorite",
        s.created_at,
        CASE
          WHEN s.available_until < NOW() THEN 'expired'
          WHEN s.quantity_available = 0 THEN 'sold_out'
          ELSE 'active'
        END AS status,
        CASE WHEN o.sarqyt_id IS NOT NULL THEN true ELSE false END AS "isReserved"
      FROM product_types pt
      JOIN sarqyts s ON s.product_type_id = pt.id
      JOIN shops sh ON sh.id = pt.shop_id
      JOIN favorites f ON f.product_type_id = pt.id AND f.user_id = $1
      LEFT JOIN orders o ON o.sarqyt_id = s.id AND o.user_id = $1 AND o.status NOT IN ('canceled')
      WHERE s.available_until > NOW()
      ORDER BY s.created_at DESC
    `, [id]);

    res.status(200).json(favorites.rows);
  } catch (error) {
    console.error('Error at getUserFavorites:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ BECOME SELLER ------------------
export const becomeSeller = async (req,res) => {
  try {
    const {id} = req.params;
    await db.query("UPDATE users SET role = 'seller' WHERE id = $1", [id]);
    res.status(200).json({ message: "Updated Successfully" });
  } catch (error) {
    console.error('Error at becomeSeller:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ CITIES ------------------
export const getCities = async (req, res) => {
  try {
    const { id } = req.user;
    const { search = '' } = req.query;

    const userResult = await db.query("SELECT country FROM users WHERE id = $1", [id]);
    if (!userResult.rows.length) return res.status(404).json({ message: "User not found" });

    const countryId = userResult.rows[0].country;

    const citiesQuery = search.trim()
      ? "SELECT id, name FROM cities WHERE country_id = $1 AND name ILIKE $2"
      : "SELECT id, name FROM cities WHERE country_id = $1";

    const params = search.trim() ? [countryId, `%${search}%`] : [countryId];
    const cities = await db.query(citiesQuery, params);

    res.status(200).json(cities.rows);
  } catch (error) {
    console.error("Error at getCities:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ SEARCH ------------------
export const search = async (req,res) => {
  try {
    const { q = "", time } = req.query;
    const { id } = req.user;

    const city = (await db.query("SELECT city FROM users WHERE id = $1", [id])).rows[0].city;

    const timeConditions = {
      morning:  ["06:00", "12:00"],
      afternoon:["12:00", "18:00"],
      evening:  ["18:00", "23:59"]
    };

    let timeFilter = "";
    let params = [`%${q}%`, id, city];

    if (time && timeConditions[time]) {
      const [start, end] = timeConditions[time];
      params.push(start, end);
      timeFilter = `AND s.pickup_start::time >= $4::time AND s.pickup_start::time < $5::time`;
    }

    const searchData = await db.query(`
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
        sh.address,
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
      LEFT JOIN shops sh ON sh.id = pt.shop_id
      LEFT JOIN favorites f ON f.product_type_id = pt.id AND f.user_id = $2
      LEFT JOIN orders o ON o.sarqyt_id = s.id AND o.user_id = $2 AND o.status NOT IN ('canceled')
      WHERE (pt.title ILIKE $1 OR sh.name ILIKE $1)
        AND sh.city = $3
        ${timeFilter}
    `, params);

    res.status(200).json(searchData.rows);
  } catch (error) {
    console.error("Error at search:", error);
    res.status(500).json({ message: error.message });
  }
};
