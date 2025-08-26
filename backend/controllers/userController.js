import { db } from "../db.js";

// ------------------ USER INFO ------------------
export const getUserInfo = async (req, res) => {
  try {
    const { id } = req.user;
    
    const info = await db.query(`
      SELECT 
        id,
        username, 
        email, 
        address, 
        country,
        city,
        role,
        agreement_at,
        created_at,
        (SELECT name FROM countries WHERE id = users.country) AS country_name,
        (SELECT name FROM cities WHERE id = users.city) AS city_name
      FROM users 
      WHERE id = $1
    `, [id]);

    if (!info.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(info.rows[0]);

  } catch (error) {
    console.error('Error at getUserInfo:', error);
    res.status(500).json({ message: error.message });
  }
};

export const changeUsername = async (req, res) => {
  try {
    const { id } = req.user;
    const { username } = req.body;

    if (!username || username.trim().length < 2) {
      return res.status(400).json({ message: "Username must be at least 2 characters long" });
    }

    const result = await db.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING username",
      [username.trim(), id]
    );

    res.status(200).json({ 
      message: "Successfully updated",
      username: result.rows[0].username 
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ message: "Username already exists" });
    }
    console.error('Error at changeUsername:', error);
    res.status(500).json({ message: error.message });
  }
};

export const changeUserCountry = async (req, res) => {
  try {
    const { id } = req.user;
    const { countryId } = req.body;

    if (!countryId) return res.status(400).json({ message: "Select country" });

    const checkCountry = await db.query("SELECT id, name FROM countries WHERE id = $1", [countryId]);
    if (!checkCountry.rows.length) return res.status(404).json({ message: "Country doesn't exist" });

    const result = await db.query(
      "UPDATE users SET country = $1, city = NULL WHERE id = $2 RETURNING country",
      [countryId, id]
    );

    res.status(200).json({ 
      message: "Successfully updated",
      country: checkCountry.rows[0].id,
      country_name: checkCountry.rows[0].name,
      city: null,
      city_name: null
    });
  } catch (error) {
    console.error('Error at changeUserCountry:', error);
    res.status(500).json({ message: error.message });
  }
};

export const changeUserCity = async (req, res) => {
  try {
    const { id } = req.user;
    const { cityId } = req.body;

    if (!cityId) return res.status(400).json({ message: "Select city" });

    // Check if city exists and belongs to user's country
    const userCountry = await db.query("SELECT country FROM users WHERE id = $1", [id]);
    if (!userCountry.rows.length) return res.status(404).json({ message: "User not found" });

    const checkCity = await db.query(
      "SELECT id, name FROM cities WHERE id = $1 AND country_id = $2",
      [cityId, userCountry.rows[0].country]
    );

    if (!checkCity.rows.length) return res.status(404).json({ message: "City doesn't exist or doesn't belong to your country" });

    const result = await db.query(
      "UPDATE users SET city = $1 WHERE id = $2 RETURNING city",
      [cityId, id]
    );

    res.status(200).json({ 
      message: "Successfully updated",
      city: checkCity.rows[0].id,
      city_name: checkCity.rows[0].name
    });
  } catch (error) {
    console.error('Error at changeUserCity:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateUserAddress = async (req, res) => {
  try {
    const { id } = req.user;
    const { address } = req.body;

    if (!address || address.trim().length < 5) {
      return res.status(400).json({ message: "Address must be at least 5 characters long" });
    }

    const result = await db.query(
      "UPDATE users SET address = $1 WHERE id = $2 RETURNING address",
      [address.trim(), id]
    );

    res.status(200).json({ 
      message: "Successfully updated",
      address: result.rows[0].address 
    });
  } catch (error) {
    console.error('Error at updateUserAddress:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ FAVORITES ------------------
export const getUserFavorites = async (req, res) => {
  try {
    const { id } = req.user;

    const favorites = await db.query(`
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
        true AS isFavorite,
        CASE
          WHEN s.available_until < NOW() THEN 'expired'
          WHEN s.quantity_available = 0 THEN 'sold_out'
          ELSE 'active'
        END AS status,
        CASE WHEN o.sarqyt_id IS NOT NULL THEN true ELSE false END AS isReserved,
        (
          SELECT json_agg(c.name)
          FROM product_type_category ptc
          JOIN categories c ON c.id = ptc.category_id
          WHERE ptc.product_type_id = pt.id
        ) AS categories
      FROM favorites f
      JOIN product_types pt ON pt.id = f.product_type_id
      JOIN sarqyts s ON s.product_type_id = pt.id
      JOIN shops sh ON sh.id = pt.shop_id
      LEFT JOIN orders o ON o.sarqyt_id = s.id AND o.user_id = $1 AND o.status NOT IN ('canceled')
      WHERE f.user_id = $1 AND s.available_until > NOW()
      ORDER BY s.created_at DESC
    `, [id]);

    res.status(200).json(favorites.rows);
  } catch (error) {
    console.error('Error at getUserFavorites:', error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ BECOME SELLER ------------------
export const becomeSeller = async (req, res) => {
  try {
    const { id } = req.user; // Get from authenticated user, not params

    // Check if user already has a shop
    const shopCheck = await db.query("SELECT 1 FROM shops WHERE user_id = $1", [id]);
    if (!shopCheck.rows.length) {
      return res.status(400).json({ message: "You need to create a shop first" });
    }

    const result = await db.query(
      "UPDATE users SET role = 'seller' WHERE id = $1 RETURNING role",
      [id]
    );

    res.status(200).json({ 
      message: "You are now a seller",
      role: result.rows[0].role 
    });
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

    let citiesQuery = `
      SELECT id, name 
      FROM cities 
      WHERE country_id = $1
    `;
    let params = [countryId];

    if (search.trim()) {
      citiesQuery += " AND name ILIKE $2";
      params.push(`%${search}%`);
    }

    citiesQuery += " ORDER BY name";

    const cities = await db.query(citiesQuery, params);

    res.status(200).json(cities.rows);
  } catch (error) {
    console.error("Error at getCities:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ COUNTRIES ------------------
export const getCountries = async (req, res) => {
  try {
    const countries = await db.query(`
      SELECT id, name, code, phone_code 
      FROM countries 
      ORDER BY name
    `);

    res.status(200).json(countries.rows);
  } catch (error) {
    console.error("Error at getCountries:", error);
    res.status(500).json({ message: error.message });
  }
};

// ------------------ SEARCH ------------------
export const search = async (req, res) => {
  try {
    const { q = "", time, categories = "" } = req.query;
    const { id } = req.user;

    const userResult = await db.query("SELECT city FROM users WHERE id = $1", [id]);
    if (!userResult.rows.length) return res.status(404).json({ message: "User not found" });

    const city = userResult.rows[0].city;
    if (!city) return res.status(400).json({ message: "Please set your city first" });

    const categoriesArr = categories
      ? (Array.isArray(categories) ? categories : categories.split(",").map(Number))
      : [];

    const timeConditions = {
      morning: ["06:00", "12:00"],
      afternoon: ["12:00", "18:00"],
      evening: ["18:00", "23:59"]
    };

    let timeFilter = "";
    let params = [city, id];
    let paramCount = 2;

    if (q.trim()) {
      params.push(`%${q}%`);
      paramCount++;
    }

    if (time && timeConditions[time]) {
      const [start, end] = timeConditions[time];
      params.push(start, end);
      timeFilter = `AND s.pickup_start::time >= $${paramCount + 1}::time AND s.pickup_start::time < $${paramCount + 2}::time`;
      paramCount += 2;
    }

    if (categoriesArr.length > 0) {
      params.push(categoriesArr);
      paramCount++;
    }

    const searchData = await db.query(`
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
        CASE WHEN f.product_type_id IS NOT NULL THEN true ELSE false END AS isFavorite,
        CASE WHEN o.sarqyt_id IS NOT NULL THEN true ELSE false END AS isReserved,
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
      LEFT JOIN product_type_category ptc ON ptc.product_type_id = pt.id
      WHERE sh.city = $1 
        AND s.available_until > NOW()
        ${q.trim() ? `AND (pt.title ILIKE $3 OR sh.name ILIKE $3)` : ''}
        ${timeFilter}
        ${categoriesArr.length > 0 ? `AND ptc.category_id = ANY($${paramCount}::int[])` : ''}
      GROUP BY s.id, pt.id, sh.id, f.product_type_id, o.sarqyt_id
      ORDER BY s.created_at DESC
    `, params);

    res.status(200).json(searchData.rows);
  } catch (error) {
    console.error("Error at search:", error);
    res.status(500).json({ message: error.message });
  }
};