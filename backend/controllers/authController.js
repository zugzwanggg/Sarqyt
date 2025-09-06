import jwt from "jsonwebtoken";
import { db } from "../db.js";
import bcryptjs from "bcryptjs";
import validator from "validator";
import { verifyTelegramAuth } from "../telegramAuth.js";

const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : 'best_secret_2025';
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const sevenDays = 7 * 24 * 60 * 60 * 1000;

export const telegramAuth = async (req,res) => {
  try {
    const { initData } = req.body;

    if (!initData) {
      return res.status(400).json({ message: 'Missing initData' });
    }

    if (!verifyTelegramAuth(initData, TG_BOT_TOKEN)) {
      return res.status(403).json({ message: 'Invalid Telegram signature' });
    }

    const params = new URLSearchParams(initData);
    const userData = JSON.parse(params.get('user') || '{}');

    if (!userData.id || !userData.first_name) {
      return res.status(400).json({ message: 'Invalid Telegram user object' });
    }

    const placeholderEmail = `tg_${userData.id}@telegram.local`;

    const existingUser = await db.query(
      'SELECT id FROM users WHERE telegram_id = $1',
      [userData.id]
    );

    let userId;

    if (existingUser.rows.length > 0) {
      await db.query(
        `UPDATE users
         SET username = $1
         WHERE telegram_id = $2`,
        [userData.username || userData.first_name, userData.id]
      );
      userId = existingUser.rows[0].id;
    } else {
      const insertRes = await db.query(
        `INSERT INTO users (telegram_id, email, username, country, city)
         VALUES ($1, $2, $3, 1, 1)
         RETURNING id`,
        [
          userData.id,
          placeholderEmail,
          userData.username || userData.first_name
        ]
      );
      userId = insertRes.rows[0].id;
    }

    const payload = { id: userId, telegram_id: userData.id };
    const token = jwt.sign(payload, JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
      maxAge: sevenDays
    });
    
    res.status(200).json({
      message: 'Telegram authentication successful',
      user: { id: userId, ...userData },
      token
    });

  } catch (error) {
    console.error('Error at tgAuth:', error.message, '\n', error.stack);
    res.status(500).json({ message: error.message });
  }
}

export const login = async (req,res) => {
  try {
    const {email, password} = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Fields cannot be empty"
      })
    }

    const userPassword = await db.query('SELECT password FROM users WHERE email = $1', [email]);
    const user = await db.query('SELECT id, username, email FROM users WHERE email = $1', [email]);

    if (user.rows.length <= 0) {
      return res.status(401).json({
        message: "Incorrect email or password"
      })
    }

    const checkPassword = await bcryptjs.compare(password, userPassword.rows[0].password)
    if (!checkPassword) {
      return res.status(401).json({
        message: "Incorrect email or password"
      })
    }

    const payload = user.rows[0];
    const token = jwt.sign(payload, JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
      maxAge: sevenDays
    });

    res.status(200).json({
      message: "Succesfully logged in"
    });

  } catch (error) {
    console.log('Error at login:', error.message + '\n' + error.stack)
    res.status(500).json(error.message)
  }
}

export const register = async (req,res) => {
  try {

    const {email, country, password, repeatPassword} = req.body;

    if (!email || !country || !password || !repeatPassword) {
      return res.status(400).json({
        message: "Fill all the fields"
      })
    }

    if (password !== repeatPassword) {
      return res.status(400).json({
        message: "Password aren't matching"
      })
    }

    const checkUser = await db.query("SELECT 1 FROM users WHERE email = $1", [email]);
    if (checkUser.rows.length >= 1) {
      return res.status(403).json({
        message: "Already registered."
      })
    }

    const checkCountry = await db.query("SELECT 1 FROM countries WHERE id = $1", [country]);
    if (checkCountry.rows.length <= 0) {
      return res.status(404).json({
        message: "Country doesn't exist"
      })
    }

    const isPasswordStrong = validator.isStrongPassword(password, {
      minLength: 6,
      minNumbers: 1
    })

    if (!isPasswordStrong) {
      return res.status(400).json({
        message: "Password is too weak."
      })
    }

    const genSalt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, genSalt);

    const newUser = await db.query("INSERT INTO users (email, country, password) VALUES ($1, $2, $3) RETURNING id, email, username", [email, country, hashPassword]);

    const payload = newUser.rows[0];
    const token = jwt.sign(payload, JWT_SECRET);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'Lax',
      maxAge: sevenDays
    });


    res.status(200).json({
      message: "Succesfully registered"
    })


  } catch (error) {
    console.log('Error at register:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}

export const isLogged = async (req,res) => {
  try {

    const token = req.cookies.token;
    
    if (!token) return res.status(403).json({
      isLogged: false
    })

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    res.json({
      user: decoded,
      isLogged: true
    })
    
  } catch (error) {
    console.log('Error at isLogged:', error.message + '\n' + error.stack);
    res.status(500).json({
      message: error.message
    })
  }
}


export const logout = async (req,res) => {
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expiresIn: new Date(0),
    sameSite: process.env.NODE_ENV === "production" ? 'none' : 'Lax'
  }).send()
}