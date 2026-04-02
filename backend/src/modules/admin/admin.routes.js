const express = require('express');
const authMiddleware = require('../../middleware/auth');
const requireRole = require('../../middleware/role');
const {
  addDestination,
  addPackage,
  getUsers,
  getBookings,
  sendNotification,
  getNotifications,
  createOffer,
  getWebsiteSettings,
  updateWebsiteSettings,
} = require('./admin.controller');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(['admin', 'super_admin']));

router.post('/destinations', addDestination);
router.post('/packages', addPackage);
router.get('/users', getUsers);
router.get('/bookings', getBookings);
router.post('/notifications', sendNotification);
router.get('/notifications', getNotifications);
router.post('/offers', createOffer);

router.get('/website-settings', requireRole(['super_admin']), getWebsiteSettings);
router.put('/website-settings', requireRole(['super_admin']), updateWebsiteSettings);

module.exports = router;
