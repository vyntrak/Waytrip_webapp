const express = require('express');
const authMiddleware = require('../../middleware/auth');
const { myNotifications, readNotification } = require('./notifications.controller');

const router = express.Router();

router.get('/my', authMiddleware, myNotifications);
router.patch('/:id/read', authMiddleware, readNotification);

module.exports = router;
