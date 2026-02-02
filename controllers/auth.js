const jwt = require("jsonwebtoken");
require("dotenv").config();
const { pool } = require("../db");

const JWT_SECRET = "mySuperSecretKey123!";
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin2025";

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Все поля обязательны" });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ email: ADMIN_EMAIL }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({ message: "Успешный вход", token });
    } else {
      res.status(400).json({ message: "Админ не найден" });
    }
  } catch (error) {
    console.error("Ошибка аутентификации:", error.message);
    res.status(500).json({ error: "Ошибка аутентификации" });
  }
};

module.exports = { signin };
