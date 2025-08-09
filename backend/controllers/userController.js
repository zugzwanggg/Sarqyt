import { db } from "../db.js";

export const getUserInfo = async (req,res) => {
  try {

    const {id} = req.user;
    
    const info = await db.query(`SELECT username, email, address, countries.name AS country, cities.name, role AS city FROM users JOIN countries ON countries.id = users.country LEFT JOIN cities ON cities.id = users.city WHERE users.id = $1`, [id]);

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

export const getUserFavorites = async (req,res) => {
  try {
    const {id} = req.user;

    const favorites = await db.query("SELECT sarqyts.id AS sarqyt_id, shops.id AS shop_id, shops.image_url as logo, shops.name AS shop, sarqyts.image_url as cover, sarqyts.title AS title FROM favorites JOIN sarqyts ON sarqyts.id = favorites.sarqyt_id JOIN shops ON shops.id = sarqyts.shop_id WHERE favorites.user_id = $1 ", [id]);

    res.status(200).json(favorites.rows);
  } catch (error) {
    console.log('Error at getUserFavorites:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}

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