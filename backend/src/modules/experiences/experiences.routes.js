const express = require('express');
const authMiddleware = require('../../middleware/auth');
const { saveExperience, getExperience, listMine } = require('./experiences.controller');

const router = express.Router();

router.get('/my', authMiddleware, listMine);
router.get('/booking/:bookingId', authMiddleware, getExperience);
router.put('/booking/:bookingId', authMiddleware, saveExperience);

module.exports = router;
