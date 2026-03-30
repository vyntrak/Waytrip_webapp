const pool = require('../../db/pool');

async function createBooking({ userId, packageId }) {
  const result = await pool.query(
    `INSERT INTO bookings (user_id, package_id, status)
     VALUES ($1, $2, 'upcoming')
     RETURNING *`,
    [userId, packageId || null],
  );

  return result.rows[0];
}

async function listUserBookings(userId) {
  const result = await pool.query(
    `SELECT b.id, b.status, b.created_at, b.package_id,
            p.title AS package_title,
            p.location AS package_location,
            p.price AS package_price
     FROM bookings b
     LEFT JOIN travel_packages p ON p.id = b.package_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId],
  );

  return result.rows;
}

module.exports = {
  createBooking,
  listUserBookings,
};
