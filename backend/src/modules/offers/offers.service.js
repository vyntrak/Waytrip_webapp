const pool = require('../../db/pool');

async function listActiveOffers() {
  const result = await pool.query(
    `SELECT o.*, p.title AS package_title
     FROM offers o
     LEFT JOIN travel_packages p ON p.id = o.package_id
     WHERE o.is_active = TRUE AND o.expiry_date > NOW()
     ORDER BY o.created_at DESC`,
  );
  return result.rows;
}

async function findValidOffer(couponCode, packageId) {
  const result = await pool.query(
    `SELECT *
     FROM offers
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
  listActiveOffers,
  findValidOffer,
};
