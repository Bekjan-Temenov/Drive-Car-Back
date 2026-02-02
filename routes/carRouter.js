const express = require("express");
const router = express.Router();
const {
  createCar,
  getCars,
  updateCar,
  deleteCar,
  getCarById,
} = require("../controllers/carController");
const { uploadFiles } = require("../uploads/upload");

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Управление автомобилями
 */

/**
 * @swagger
 * /cars:
 *   post:
 *     summary: Создать автомобиль
 *     tags: [Cars]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               brand:
 *                 type: string
 *               model:
 *                 type: string
 *               year:
 *                 type: integer
 *               mileage:
 *                 type: integer
 *               description:
 *                 type: string
 *               body_type:
 *                 type: string
 *               price:
 *                 type: number
 *               condition:
 *                 type: string
 *               color:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                   multiple: true
 *     responses:
 *       201:
 *         description: Автомобиль успешно создан
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Ошибка сервера при создании автомобиля
 *         content:
 */

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Получить все автомобили
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: Список всех автомобилей с изображениями
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   brand:
 *                     type: string
 *                   model:
 *                     type: string
 *                   year:
 *                     type: integer
 *                   mileage:
 *                     type: integer
 *                   description:
 *                     type: string
 *                   body_type:
 *                     type: string
 *                   price:
 *                     type: number
 *                   condition:
 *                     type: string
 *                   color:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   images:
 *                     type: array
 *                     items:
 *                       type: string
 *       500:
 *         description: Ошибка сервера при получении автомобилей
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /cars/{id}:
 *   put:
 *     summary: Обновить автомобиль
 *     tags: [Cars]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Автомобиль успешно обновлен
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Ошибка сервера при обновлении автомобиля
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /cars/{id}:
 *   delete:
 *     summary: Удалить автомобиль
 *     tags: [Cars]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Автомобиль успешно удален
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Ошибка сервера при удалении автомобиля
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

router.post("/", uploadFiles, createCar);
router.get("/", getCars);
router.put("/:id", updateCar);
router.delete("/:id", deleteCar);
router.get("/:id", getCarById);

module.exports = router;
