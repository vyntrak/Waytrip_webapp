const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const destinationsRoutes = require('../modules/destinations/destinations.routes');
const packagesRoutes = require('../modules/packages/packages.routes');
const bookingsRoutes = require('../modules/bookings/bookings.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'WAYTRIP API' });
});

router.use('/auth', authRoutes);
router.use('/destinations', destinationsRoutes);
router.use('/packages', packagesRoutes);
router.use('/bookings', bookingsRoutes);

module.exports = router;
