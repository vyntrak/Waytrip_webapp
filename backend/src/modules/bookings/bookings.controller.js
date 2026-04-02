const { createBooking, listUserBookings } = require('./bookings.service');

async function create(req, res) {
  const userId = req.user.sub;
  const { packageId } = req.body;

  if (packageId !== undefined && Number.isNaN(Number(packageId))) {
    return res.status(400).json({ message: 'packageId must be a number' });
  }

  const booking = await createBooking({
    userId,
    packageId: packageId ? Number(packageId) : null,
  });

  return res.status(201).json({
    message: 'Booking created successfully',
    booking,
  });
}

async function getMine(req, res) {
  const userId = req.user.sub;
  const bookings = await listUserBookings(userId);
  return res.status(200).json({ bookings });
}

module.exports = {
  create,
  getMine,
};
