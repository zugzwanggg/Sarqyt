import { db } from "../db.js";

export const getUserInfo = async (req,res) => {
  try {

    const {id} = req.user;
    
    const info = await db.query(`SELECT username, email, address, countries.name AS country, cities.name AS city, users.city AS cityId, role  FROM users JOIN countries ON countries.id = users.country LEFT JOIN cities ON cities.id = users.city WHERE users.id = $1`, [id]);

    res.status(200).json(info.rows[0]);

  } catch (error) {
    console.log('Error at getUserInfo:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}


export const changeUsername = async (req,res) => {
  try {

    const {id} = req.user;
    const {username} = req.body;

    // if (username === req.user.username) {
    //   return res.status(400).json({
    //     message: ""
    //   })
    // }

    await db.query("UPDATE users SET username = $1 WHERE id = $2", [username, id]);

    res.status(200).json({
      message: "Succesfully updated"
    })
    
  } catch (error) {
    console.log('Error at changeUserName:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}

export const changeUserCountry = async (req,res) => {
  try {
    const {id} = req.user;
    const {countryId} = req.body;

    if (!countryId) {
      return res.status(400).json({
        message: "Select country"
      })
    }

    const checkCountry = await db.query("SELECT * FROM countries WHERE id = $1", [countryId]);
    if (checkCountry.rows.length <= 0) {
      return res.status(404).json({
        message: "Country doesn't exist"
      })
    }

    await db.query("UPDATE users SET country = $1 WHERE id = $2", [countryId, id]);

    res.status(200).json({
      message: "Succesfully updated"
    })

  } catch (error) {
    console.log('Error at changeUserCountry:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}

export const changeUserCity = async (req,res) => {
  try {
    const {id} = req.user;
    const {cityId} = req.body;

    if (!cityId) {
      return res.status(400).json({
        message: "Select city"
      })
    }

    const checkCity = await db.query("SELECT 1 FROM cities WHERE id = $1", [cityId]);
    if (checkCity.rows.length <= 0) {
      return res.status(404).json({
        message: "City doesn't exist"
      })
    }

    await db.query("UPDATE users SET city = $1 WHERE id = $2", [cityId, id]);
    res.status(200).json({
      message: "Succesfully updated"
    })

  } catch (error) {
    console.log('Error at changeUserCity:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}

export const getUserFavorites = async (req, res) => {
  try {
    const { id } = req.user;

    const favorites = await db.query(`
      SELECT DISTINCT
        sarqyts.id AS id,
        sarqyts.title,
        sarqyts.original_price,
        sarqyts.discounted_price,
        sarqyts.quantity_available,
        sarqyts.pickup_start,
        sarqyts.pickup_end,
        sarqyts.image_url,
        shops.id AS shop_id,
        shops.image_url as logo,
        shops.name AS shop,
        true AS "isFavorite",
        sarqyts.created_at,
        CASE
          WHEN sarqyts.available_until < NOW() THEN 'expired'
          WHEN sarqyts.quantity_available = 0 THEN 'sold_out'
          ELSE 'active'
        END AS status,
        CASE WHEN orders.sarqyt_id IS NOT NULL THEN true ELSE false END As "isReserved"
      FROM sarqyts 
      JOIN shops ON shops.id = sarqyts.shop_id 
      JOIN favorites ON favorites.sarqyt_id = sarqyts.id
      LEFT JOIN orders 
        ON orders.sarqyt_id = sarqyts.id AND orders.user_id = $1 AND orders.status NOT IN ('canceled')
      WHERE favorites.user_id = $1
      ORDER BY sarqyts.created_at DESC;
    `, [id]);

    res.status(200).json(favorites.rows);
  } catch (error) {
    console.log('Error at getUserFavorites:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    });
  }
};

export const becomeSeller = async (req,res) => {
  try {

    const {id} = req.params;

    await db.query("UPDATE users SET role = 'seller' WHERE id = $1", [id]);

    res.status(200).json({
      message: "Updated Succesfully"
    })

  } catch (error) {
    console.log('Error at becomeSeller:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}


export const getCities = async (req, res) => {
  try {
    const { id } = req.user;
    const { search = '' } = req.query;

    const userResult = await db.query("SELECT country FROM users WHERE id = $1", [id]);
    if (!userResult.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const countryId = userResult.rows[0].country;

    let cities;
    if (search.trim()) {
      cities = await db.query(
        "SELECT id, name FROM cities WHERE country_id = $1 AND name ILIKE $2",
        [countryId, `%${search}%`]
      );
    } else {
      cities = await db.query(
        "SELECT id, name FROM cities WHERE country_id = $1",
        [countryId]
      );
    }

    res.status(200).json(cities.rows);
  } catch (error) {
    console.error("Error at getCities:", error);
    res.status(500).json({ message: error.message });
  }
};


export const search = async (req,res) => {
  try {

    const {q} =req.query;

    const {id} = req.user;
    const city = (await db.query("SELECT city FROM users WHERE id = $1", [id])).rows[0].city;

    const searchData = await db.query(`
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
      shops.image_url AS logo,
      shops.name AS shop,
      shops.address,
      s.created_at,
      CASE WHEN favorites.sarqyt_id IS NOT NULL THEN true ELSE false END AS "isFavorite",
      CASE WHEN orders.sarqyt_id IS NOT NULL THEN true ELSE false END As "isReserved",
      CASE
        WHEN s.available_until < NOW() THEN 'expired'
        WHEN s.quantity_available = 0 THEN 'sold_out'
        ELSE 'active'
      END AS status,
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
      WHERE s.title ILIKE $1 OR shops.name ILIKE $1
    `, [`%${q}%`, id]);

    res.status(200).json(searchData.rows)
    
  } catch (error) {
    console.error("Error at search:", error);
    res.status(500).json({ message: error.message });
  }
}