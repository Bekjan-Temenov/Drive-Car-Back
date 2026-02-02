const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviews,
  deleteReview,
  updateReview,
} = require("../controllers/reviewsController");


/**
 * @swagger
 * tags:
 *  name: Reviews
 *  description: Управление отзывами
 */
/**
 * @swagger
 * /reviews:
 *  post:
 *    summary: Создать новый отзыв
 *    tags: [Reviews]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              rating:
 *                type: number
 *                description: Оценка от 1 до 5
 *              comment:
 *                type: string
 *                description: Комментарий
 *              user_id:
 *                type: string
 *                description: ID пользователя
 *    responses:
 *      201:
 *        description: Отзыв успешно создан
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                id:
 *                  type: number
 *                  description: ID отзыва
 *                rating:
 *                  type: number
 *                  description: Оценка
 *                comment:
 *                  type: string
 *                  description: Комментарий
 *                user_id:
 *                  type: string
 *                  description: ID пользователя
 *      400:
 *        description: Некорректные данные
 *      500:
 *        description: Ошибка сервера
 */
/**
 * @swagger
 * /reviews:
 *  get:
 *    summary: Получить все отзывы
 *    tags: [Reviews]
 *    responses:
 *      200:
 *        description: Список всех отзывов
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Review'
 *      500:
 *        description: Ошибка сервера
 */
/**
 * @swagger
 * /reviews/{id}:
 *  put:
 *    summary: Обновить отзыв
 *    tags: [Reviews]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              rating:
 *                type: number
 *                description: Оценка от 1 до 5
 *              comment:
 *                type: string
 *                description: Комментарий
 *    responses:
 *      200:
 *        description: Отзыв успешно обновлен
 *      404:
 *        description: Отзыв не найден
 *      500:
 *        description: Ошибка сервера
 */
/**
 * @swagger
 * /reviews/{id}:
 *  delete:
 *    summary: Удалить отзыв
 *    tags: [Reviews]
 *    parameters:
 *      - name: id
 *        in: path
 *        required: true
 *        type: string
 *    responses:
 *      200:
 *        description: Отзыв успешно удален
 *      404:
 *        description: Отзыв не найден
 *      500:
 *        description: Ошибка сервера
 */

router.post("/", createReview);
router.get("/", getReviews);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

module.exports = router;
