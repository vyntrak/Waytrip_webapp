const express = require('express');
const authRoutes = require('../modules/auth/auth.routes');
const adminRoutes = require('../modules/admin/admin.routes');
const crmRoutes = require('../modules/crm/crm.routes');
const destinationsRoutes = require('../modules/destinations/destinations.routes');
const packagesRoutes = require('../modules/packages/packages.routes');
const bookingsRoutes = require('../modules/bookings/bookings.routes');
const offersRoutes = require('../modules/offers/offers.routes');
const notificationsRoutes = require('../modules/notifications/notifications.routes');
const analyticsRoutes = require('../modules/analytics/analytics.routes');
const experiencesRoutes = require('../modules/experiences/experiences.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'WAYTRIP API' });
});

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/crm', crmRoutes);
router.use('/destinations', destinationsRoutes);
router.use('/packages', packagesRoutes);
router.use('/bookings', bookingsRoutes);
router.use('/offers', offersRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/experiences', experiencesRoutes);

module.exports = router;
