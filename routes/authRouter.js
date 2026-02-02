const express = require('express');
const router = express.Router();
const { signin } = require('../controllers/auth');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Управление аутентификацией и авторизацией пользователей
 */
/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Вход в систему
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Пользователь успешно авторизован
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     token:
 *                       type: string
 *       401:
 *         description: Неверный email или пароль
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.post('/signin', signin);

module.exports = router;