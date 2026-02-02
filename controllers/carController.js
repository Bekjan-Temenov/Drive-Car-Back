const { pool } = require("../db");
const fs = require("fs");
const path = require("path");

const createCar = async (req, res) => {
  const {
    brand,
    model,
    year,
    mileage,
    description,
    body_type,
    price,
    condition,
    color,
    engine,
    status,
  } = req.body;
  const images = req.files ? req.files.map((file) => file.filename) : [];

  try {
    const newCar = await pool.query(
      "INSERT INTO cars (brand, model, year, mileage, description, body_type, price, condition, color, engine, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        brand,
        model,
        year,
        mileage,
        description,
        body_type,
        price,
        condition,
        color,
        engine,
        status,
      ]
    );

    const carId = newCar.rows[0].id;

    if (images.length > 0) {
      const imagePromises = images.map((image_url) => {
        return pool.query(
          "INSERT INTO car_images (car_id, image_url) VALUES ($1, $2)",
          [carId, image_url]
        );
      });
      await Promise.all(imagePromises);
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/uploads/`;
    const imageUrlsWithBase = images.map((image) => `${baseUrl}${image}`);

    res.status(201).json({
      ...newCar.rows[0],
      images: imageUrlsWithBase,
    });
  } catch (error) {
    console.error("Ошибка создания автомобиля:", error.message);
    res.status(500).json({ error: "Ошибка создания автомобиля" });
  }
};

const getCars = async (req, res) => {
  const { minPrice, maxPrice, sort, search, price } = req.query;

  try {
    let query = `
          SELECT c.*, ci.image_url
          FROM cars c
          LEFT JOIN car_images ci ON c.id = ci.car_id
          WHERE 1=1
      `;
    const params = [];

    if (minPrice) {
      query += ` AND c.price >= $${params.length + 1}`;
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ` AND c.price <= $${params.length + 1}`;
      params.push(maxPrice);
    }

    if (price) {
      query += ` AND c.price = $${params.length + 1}`;
      params.push(price);
    }

    if (search) {
      query += ` AND (c.brand ILIKE $${params.length + 1} 
                          OR c.model ILIKE $${params.length + 2} 
                          OR c.description ILIKE $${params.length + 3} 
                          OR c.color ILIKE $${params.length + 4} 
                          OR c.engine ILIKE $${params.length + 5} 
                          OR c.body_type ILIKE $${params.length + 6})`;
      params.push(
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`
      );
    }

    if (sort) {
      switch (sort) {
        case "expensive":
          query += " ORDER BY c.price DESC";
          break;
        case "cheap":
          query += " ORDER BY c.price ASC";
          break;
        case "new":
          query += " ORDER BY c.year DESC";
          break;
        case "old":
          query += " ORDER BY c.year ASC";
          break;
        default:
          query += " ORDER BY c.id ASC";
          break;
      }
    } else {
      query += " ORDER BY c.id ASC";
    }
    const cars = await pool.query(query, params);

    const carsWithImages = cars.rows.reduce((acc, car) => {
      const { image_url, ...carData } = car;
      const existingCar = acc.find((item) => item.id === carData.id);

      if (existingCar) {
        if (image_url) {
          if (!existingCar.images.includes(image_url)) {
            existingCar.images.push(image_url);
          }
        }
      } else {
        acc.push({ ...carData, images: image_url ? [image_url] : [] });
      }

      return acc;
    }, []);

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/uploads/`;

    const carsWithImageUrls = carsWithImages.map((car) => ({
      ...car,
      images: car.images.map((image) => `${baseUrl}${image.split("/").pop()}`),
    }));

    res.status(200).json(carsWithImageUrls);
  } catch (error) {
    console.error("Ошибка получения автомобилей:", error.message);
    res.status(500).json({ error: "Ошибка получения автомобилей" });
  }
};

const updateCar = async (req, res) => {
  const { id } = req.params;
  const {
    brand,
    model,
    year,
    mileage,
    description,
    body_type,
    price,
    condition,
    color,
    engine,
    status,
  } = req.body;
  const images = req.files ? req.files.map((file) => file.filename) : [];

  try {
    const updatedCar = await pool.query(
      "UPDATE cars SET brand = $1, model = $2, year = $3, mileage = $4, description = $5, body_type = $6, price = $7, condition = $8, color = $9, engine = $10, status = $11 WHERE id = $12 RETURNING *",
      [
        brand,
        model,
        year,
        mileage,
        description,
        body_type,
        price,
        condition,
        color,
        engine,
        status,
        id,
      ]
    );

    if (updatedCar.rows.length === 0) {
      return res.status(404).json({ error: "Автомобиль не найден" });
    }

    const carId = updatedCar.rows[0].id;

    if (images.length > 0) {
      await pool.query("DELETE FROM car_images WHERE car_id = $1", [carId]);
      const imagePromises = images.map((image_url) => {
        return pool.query(
          "INSERT INTO car_images (car_id, image_url) VALUES ($1, $2)",
          [carId, image_url]
        );
      });
      await Promise.all(imagePromises);
    }

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/uploads/`;
    const imageUrlsWithBase = images.map((image) => `${baseUrl}${image}`);

    res.status(200).json({
      ...updatedCar.rows[0],
      images: imageUrlsWithBase,
    });
  } catch (error) {
    console.error("Ошибка обновления автомобиля:", error.message);
    res.status(500).json({ error: "Ошибка обновления автомобиля" });
  }
};

const deleteCar = async (req, res) => {
  const { id } = req.params;

  try {
    const carImages = await pool.query(
      "SELECT image_url FROM car_images WHERE car_id = $1",
      [id]
    );

    const deletedCar = await pool.query(
      "DELETE FROM cars WHERE id = $1 RETURNING *",
      [id]
    );

    if (deletedCar.rows.length === 0) {
      return res.status(404).json({ error: "Автомобиль не найден" });
    }

    carImages.rows.forEach((image) => {
      const filePath = path.join(
        __dirname,
        "../uploads/uploads",
        image.image_url
      );
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Ошибка при удалении файла ${filePath}:`, err);
        }
      });
    });

    await pool.query("DELETE FROM car_images WHERE car_id = $1", [id]);

    res
      .status(200)
      .json({ message: "Автомобиль и его изображения успешно удалены" });
  } catch (error) {
    console.error("Ошибка удаления автомобиля:", error.message);
    res.status(500).json({ error: "Ошибка удаления автомобиля" });
  }
};

const getCarById = async (req, res) => {
  const { id } = req.params;

  try {
    const car = await pool.query(
      `
            SELECT c.*, ci.image_url
            FROM cars c
            LEFT JOIN car_images ci ON c.id = ci.car_id
            WHERE c.id = $1
        `,
      [id]
    );

    if (car.rows.length === 0) {
      return res.status(404).json({ error: "Автомобиль не найден" });
    }

    const { image_url, ...carData } = car.rows[0];
    const images = car.rows.map((row) => row.image_url).filter((url) => url);

    res.status(200).json({ ...carData, images });
  } catch (error) {
    console.error("Ошибка получения автомобиля:", error.message);
    res.status(500).json({ error: "Ошибка получения автомобиля" });
  }
};

const deleteAllImages = async (req, res) => {
  const uploadDir = path.join(__dirname, "../uploads/uploads");

  fs.readdir(uploadDir, (err, files) => {
    if (err) {
      console.error("Ошибка чтения директории:", err);
      return res.status(500).json({ error: "Ошибка чтения директории" });
    }

    files.forEach((file) => {
      const filePath = path.join(uploadDir, file);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Ошибка при удалении файла ${filePath}:`, err);
        }
      });
    });

    res.status(200).json({ message: "Все изображения успешно удалены" });
  });
};

module.exports = {
  createCar,
  getCars,
  updateCar,
  deleteCar,
  getCarById,
  deleteAllImages,
};
