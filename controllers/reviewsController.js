const { pool } = require("../db");
const createReview = async (req, res) => {
  const { rating, comment, user_id } = req.body;
  try {
    const review = await pool.query(
      "INSERT INTO reviews (user_id, rating, comment) VALUES ($1, $2, $3) RETURNING *",
      [user_id, rating, comment]
    );
    res.json(review.rows[0]);
  } catch (error) {
    console.error("Ошибка при создании отзыва:", error);
    res.status(500).json({ error: "Ошибка при создании отзыва" });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await pool.query("SELECT * FROM reviews");
    res.json(reviews.rows);
  } catch (error) {
    console.error("Ошибка при получении отзывов:", error);
    res.status(500).json({ error: "Ошибка при получении отзывов" });
  }
};
const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    await pool.query(
      "UPDATE reviews SET rating = $1, comment = $2 WHERE id = $3",
      [rating, comment, id]
    );
    res.json({ message: "Отзыв обновлен" });
  } catch (error) {
    console.error("Ошибка при обновлении отзыва:", error);
    res.status(500).json({ error: "Ошибка при обновлении отзыва" });
  }
};
const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM reviews WHERE id = $1", [id]);
    res.json({ message: "Отзыв удален" });
  } catch (error) {
    console.error("Ошибка при удалении отзыва:", error);
    res.status(500).json({ error: "Ошибка при удалении отзыва" });
  }
};
module.exports = { createReview, getReviews, deleteReview , updateReview };
