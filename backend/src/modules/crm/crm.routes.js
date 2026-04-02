const express = require('express');
const authMiddleware = require('../../middleware/auth');
const requireRole = require('../../middleware/role');
const {
  getBookings,
  patchBookingStatus,
  patchBookingNotes,
  getUsers,
  getUserHistory,
  patchUserContact,
} = require('./crm.controller');

const router = express.Router();

router.use(authMiddleware);
router.use(requireRole(['CRM_MANAGER', 'super_admin']));

router.get('/bookings', getBookings);
router.patch('/bookings/:id/status', patchBookingStatus);
router.patch('/bookings/:id/notes', patchBookingNotes);

router.get('/users', getUsers);
router.get('/users/:id/history', getUserHistory);
router.patch('/users/:id/contact', patchUserContact);

module.exports = router;
