const express = require('express');
const { getOffers, validateOffer } = require('./offers.controller');

const router = express.Router();

router.get('/', getOffers);
router.get('/validate', validateOffer);

module.exports = router;
