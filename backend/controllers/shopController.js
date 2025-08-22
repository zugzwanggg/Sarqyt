import { db } from "../db.js";

export const getShopById = async (req,res) => {
  try {

    const {id} = req.params;

    const shops = await db.query("SELECT * FROM shops WHERE id = $1", [id]);

    if (shops.rows.length <= 0) {
      return res.status(404).json({
        message: "Shop doesn't exist."
      })
    }

    res.status(200).json(shops.rows[0])

  } catch (error) {
    console.log('Error at getShopById:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}


export const getShopSarqytsById = async (req,res) => {
  try {
    const {shopId} = req.params;

    const checkShop = await db.query("SELECT 1 FROM shops WHERE id = $1", [shopId]);
    if (checkShop.rows.length <= 0) {
      return res.status(404).json({
        message: "Shop doesn't exist"
      })
    }

    const sarqyts = await db.query("SELECT sarqyts.* FROM sarqyts JOIN shops ON shops.id = sarqyts.shop_id LEFT JOIN sarqyt_category ON sarqyt_category.sarqyt_id = sarqyts.id WHERE shops.id = $1", [shopId]);

    res.status(200).json(sarqyts.rows);
    
  } catch (error) {
    console.log('Error at getShopSarqytsById:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}

export const addUserShop = async (req,res) => {
  try {

    const {id} = req.user;
    const {name, image_url, description, address, link, country, city, lat, lng} = req.body;
    
    if (!name || !description || !address || !country || !city ) {
      return res.status(400).json({
        message: "Fill all the fields"
      })
    }

    await db.query("INSERT INTO shops (name, image_url, description, address, link, country, city, lat, lng, user_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)", [name, image_url, description, address, link, country, city, lat, lng, id])
    
    res.status(200).json({
      message: "Shop added succesfully"
    })
  } catch (error) {
    console.log('Error at addUserShop:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}


export const editShop = async (req,res) => {
  try {

    const {shopId} = req.params;
    const {name, image_url, description, address, link, country, city, lat, lng} = req.body;
    if (!name || !description || !address || !country || !city ) {
      return res.status(400).json({
        message: "Fill all the fields"
      })
    }

    await db.query("UPDATE shops SET name = $2, image_url = $3, description = $4, address = $5, link = $6, country = $7, city = $8, lat = $9, lng = $10 WHERE id = $1", [shopId, name, image_url, description, address, link, country, city, lat, lng])

    res.status(200).json({
      message: "Succesfully updated"
    })
  } catch (error) {
    console.log('Error at editShop:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}

export const deleteShop = async (req,res) => {
  try {
    const {shopsId} = req.params;

    await db.query("DELETE FROM shops WHERE id = $1", [shopsId])
  } catch (error) {
    console.log('Error at deleteShop:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}