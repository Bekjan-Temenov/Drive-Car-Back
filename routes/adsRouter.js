const express = require("express");
const router = express.Router();
const {
  createAd,
  getAds,
  updateAd,
  deleteAd,
} = require("../controllers/adsController");
const { uploadSingleImage } = require("../uploads/adsUpload");

/**
 * @swagger
 * tags:
 *   name: Ads
 *   description: Управление объявлениями
 */
/**
 * @swagger
 * /ads:
 *   post:
 *     summary: Создать новое объявление
 *     tags: [Ads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               button_text:
 *                 type: string
 *               instagram_url:
 *                 type: string
 *               telegram_url:
 *                 type: string
 *               whatsapp_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Объявление успешно создано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ad'
 *       500:
 *         description: Ошибка при создании объявления
 */
/**
 * @swagger
 * /ads:
 *   get:
 *     summary: Получить все объявления
 *     tags: [Ads]
 *     responses:
 *       200:
 *         description: Список всех объявлений
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ad'
 *       500:
 *         description: Ошибка при получении объявлений
 */
/**
 * @swagger
 * /ads/{id}:
 *   put:
 *     summary: Обновить объявление
 * 
 *     tags: [Ads]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID объявления
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               button_text:
 *                 type: string
 *               instagram_url:
 *                 type: string
 *               telegram_url:
 *                 type: string
 *               whatsapp_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Объявление успешно обновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ad'
 *       500:
 *         description: Ошибка при обновлении объявления
 */
/**
 * @swagger
 * /ads/{id}:
 *   delete:
 *     summary: Удалить объявление
 *     tags: [Ads]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID объявления
 *     responses:
 *       200:
 *         description: Объявление успешно удалено
 *       500:
 *         description: Ошибка при удалении объявления
 */

router.post("/", uploadSingleImage, createAd);
router.get("/", getAds);
router.put("/:id", uploadSingleImage, updateAd);
router.delete("/:id", deleteAd);

module.exports = router;