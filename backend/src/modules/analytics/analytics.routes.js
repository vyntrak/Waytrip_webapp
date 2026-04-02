const express = require('express');
const authMiddleware = require('../../middleware/auth');
const { overview, analyticsRoleGuard } = require('./analytics.controller');

const router = express.Router();

router.get('/overview', authMiddleware, analyticsRoleGuard, overview);

module.exports = router;
