import { db } from "../db.js";


export const getSarqytsByUsersCity = async (req,res) => {
  try {
    
    const {id} = req.user;
    const {categoryId = null} = req.query;

    const city = await db.query("SELECT city FROM users WHERE id = $1", [id]);

    let sarqyts;
    if (categoryId) {
      sarqyts = await db.query(`
        SELECT 
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
          shops.name AS shop
        FROM sarqyts 
        JOIN shops ON shops.id = sarqyts.shop_id 
        LEFT JOIN sarqyt_category 
          ON sarqyt_category.sarqyt_id = sarqyts.id 
        WHERE shops.city = $1 
          AND sarqyt_category.category_id = $2
      `, [city.rows[0].city, categoryId]);
    } else {
      sarqyts = await db.query(`
        SELECT 
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
          shops.name AS shop
        FROM sarqyts 
        JOIN shops ON shops.id = sarqyts.shop_id 
        WHERE shops.city = $1
      `, [city.rows[0].city]);
    }    

    res.status(200).json(sarqyts.rows);
  } catch (error) {
    console.log('Error at getSarqytByUsersCity:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}

export const getSarqytById = async (req,res) => {
  try {
    const {id} = req.params;

    const sarqyt = await db.query(`
      SELECT 
        s.id,
        s.title,
        s.original_price,
        s.discounted_price,
        s.quantity_available,
        s.pickup_start,
        s.pickup_end,
        s.image_url,
        s.created_at,
        json_agg(c.name) AS categories
      FROM sarqyts s
      LEFT JOIN sarqyt_category sc ON s.id = sc.sarqyt_id
      LEFT JOIN categories c ON c.id = sc.category_id
      GROUP BY s.id;
    `, [id]);

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