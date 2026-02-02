const { pool } = require("../db");

const createAd = async (req, res) => {
  const {
    title,
    description,
    button_text,
    instagram_url,
    telegram_url,
    whatsapp_url,
  } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const newAd = await pool.query(
      "INSERT INTO ads (image, title, description, button_text, instagram_url, telegram_url, whatsapp_url) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        image,
        title,
        description,
        button_text,
        instagram_url,
        telegram_url,
        whatsapp_url,
      ]
    );

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/uploads/`;
    const imageUrlsWithBase = image ? `${baseUrl}${image}` : null;

    res.json({
      ...newAd.rows[0],
      image: imageUrlsWithBase,
    });
  } catch (error) {
    console.error("Ошибка при создании объявления:", error);
    res.status(500).json({ error: "Ошибка при создании объявления" });
  }
};

const getAds = async (req, res) => {
  try {
    const ads = await pool.query("SELECT * FROM ads");
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/uploads/`;
    const adsWithImageUrls = ads.rows.map((ad) => ({
      ...ad,
      image: ad.image ? `${baseUrl}${ad.image}` : null,
    }));

    res.json(adsWithImageUrls);
  } catch (error) {
    console.error("Ошибка при получении объявлений:", error);
    res.status(500).json({ error: "Ошибка при получении объявлений" });
  }
};

const updateAd = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    button_text,
    instagram_url,
    telegram_url,
    whatsapp_url,
  } = req.body;

  const image = req.file ? req.file.filename : null;

  try {
    const existingAd = await pool.query("SELECT image FROM ads WHERE id = $1", [
      id,
    ]);

    if (existingAd.rows.length === 0) {
      return res.status(404).json({ error: "Реклама не найдена" });
    }
    const updatedImage = image || existingAd.rows[0].image;

    const updatedAd = await pool.query(
      "UPDATE ads SET title = $1, description = $2, button_text = $3, image = $4, instagram_url = $5, telegram_url = $6, whatsapp_url = $7 WHERE id = $8 RETURNING *",
      [
        title,
        description,
        button_text,
        updatedImage,
        instagram_url,
        telegram_url,
        whatsapp_url,
        id,
      ]
    );

    if (updatedAd.rows.length === 0) {
      return res.status(404).json({ error: "Реклама не найдена" });
    }
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/uploads/`;
    const adsWithImageUrls = updatedAd.rows.map((ad) => ({
      ...ad,
      image: ad.image ? `${baseUrl}${ad.image}` : null,
    }));

    res.json(adsWithImageUrls[0]);
  } catch (error) {
    console.error("Ошибка при обновлении объявления:", error.message);
    res.status(500).json({ error: "Ошибка при обновлении объявления" });
  }
};

const deleteAd = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM ads WHERE id = $1", [id]);
    res.json({ message: "Объявление успешно удалено" });
  } catch (error) {
    console.error("Ошибка при удалении объявления:", error);
    res.status(500).json({ error: "Ошибка при удалении объявления" });
  }
};

module.exports = { createAd, getAds, updateAd, deleteAd };
