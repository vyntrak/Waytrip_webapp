const pool = require('../../db/pool');

async function createBooking({ userId, packageId, couponCode = null, basePrice = null, discountPercentage = 0, finalPrice = null }) {
  const result = await pool.query(
    `INSERT INTO bookings (user_id, package_id, status, coupon_code, base_price, discount_percentage, final_price)
     VALUES ($1, $2, 'upcoming', $3, $4, $5, $6)
     RETURNING *`,
    [userId, packageId || null, couponCode, basePrice, discountPercentage, finalPrice],
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

async function getPackageById(packageId) {
  const result = await pool.query('SELECT id, title, price FROM travel_packages WHERE id = $1', [packageId]);
  return result.rows[0] || null;
}

async function getValidOfferByCode(couponCode, packageId) {
  const result = await pool.query(
    `SELECT * FROM offers
     WHERE coupon_code = $1
       AND package_id = $2
       AND is_active = TRUE
       AND expiry_date > NOW()
     LIMIT 1`,
    [String(couponCode).trim().toUpperCase(), packageId],
  );
  return result.rows[0] || null;
}

module.exports = {
  createBooking,
  listUserBookings,
  getPackageById,
  getValidOfferByCode,
};
