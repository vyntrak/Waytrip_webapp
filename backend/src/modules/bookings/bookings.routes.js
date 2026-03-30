const express = require('express');
const authMiddleware = require('../../middleware/auth');
const { create, getMine } = require('./bookings.controller');

const router = express.Router();

router.post('/', authMiddleware, create);
router.get('/me', authMiddleware, getMine);

module.exports = router;
