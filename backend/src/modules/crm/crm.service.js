const pool = require('../../db/pool');

async function listAllBookings() {
  const result = await pool.query(
    `SELECT b.id, b.status, b.notes, b.created_at,
            u.id AS user_id, u.first_name, u.last_name, u.email, u.phone,
            p.id AS package_id, p.title AS package_title, p.location AS package_location, p.price AS package_price
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     LEFT JOIN travel_packages p ON p.id = b.package_id
     ORDER BY b.created_at DESC`,
  );
  return result.rows;
}

async function updateBookingStatus(id, status) {
  const result = await pool.query(
    `UPDATE bookings
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, id],
  );
  return result.rows[0] || null;
}

async function updateBookingNotes(id, notes) {
  const result = await pool.query(
    `UPDATE bookings
     SET notes = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [notes, id],
  );
  return result.rows[0] || null;
}

async function searchUsers(searchText) {
  const wildcard = `%${searchText || ''}%`;
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, role, phone, contact_notes, created_at
     FROM users
     WHERE first_name ILIKE $1 OR last_name ILIKE $1 OR email ILIKE $1
     ORDER BY created_at DESC`,
    [wildcard],
  );
  return result.rows;
}

async function getUserTravelHistory(userId) {
  const result = await pool.query(
    `SELECT b.id, b.status, b.notes, b.created_at,
            p.title AS package_title, p.location AS package_location, p.price AS package_price
     FROM bookings b
     LEFT JOIN travel_packages p ON p.id = b.package_id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId],
  );
  return result.rows;
}

async function updateUserContact(userId, { phone, contactNotes }) {
  const result = await pool.query(
    `UPDATE users
     SET phone = $1,
         contact_notes = $2,
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, first_name, last_name, email, role, phone, contact_notes`,
    [phone || null, contactNotes || null, userId],
  );

  return result.rows[0] || null;
}

module.exports = {
  listAllBookings,
  updateBookingStatus,
  updateBookingNotes,
  searchUsers,
  getUserTravelHistory,
  updateUserContact,
};
