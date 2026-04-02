const {
  listAllBookings,
  updateBookingStatus,
  updateBookingNotes,
  searchUsers,
  getUserTravelHistory,
  updateUserContact,
} = require('./crm.service');

const ALLOWED_STATUSES = ['upcoming', 'completed', 'cancelled'];

async function getBookings(req, res) {
  const bookings = await listAllBookings();
  return res.status(200).json({ bookings });
}

async function patchBookingStatus(req, res) {
  const id = Number(req.params.id);
  const status = (req.body.status || '').toLowerCase();

  if (!id) {
    return res.status(400).json({ message: 'Invalid booking id' });
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'status must be upcoming/completed/cancelled' });
  }

  const booking = await updateBookingStatus(id, status);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  return res.status(200).json({ message: 'Booking status updated', booking });
}

async function patchBookingNotes(req, res) {
  const id = Number(req.params.id);
  const notes = req.body.notes || '';

  if (!id) {
    return res.status(400).json({ message: 'Invalid booking id' });
  }

  const booking = await updateBookingNotes(id, notes);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  return res.status(200).json({ message: 'Booking notes updated', booking });
}

async function getUsers(req, res) {
  const users = await searchUsers(req.query.search || '');
  return res.status(200).json({ users });
}

async function getUserHistory(req, res) {
  const userId = Number(req.params.id);
  if (!userId) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const history = await getUserTravelHistory(userId);
  return res.status(200).json({ history });
}

async function patchUserContact(req, res) {
  const userId = Number(req.params.id);
  const { phone, contactNotes } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'Invalid user id' });
  }

  const user = await updateUserContact(userId, { phone, contactNotes });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ message: 'User contact updated', user });
}

module.exports = {
  getBookings,
  patchBookingStatus,
  patchBookingNotes,
  getUsers,
  getUserHistory,
  patchUserContact,
};
