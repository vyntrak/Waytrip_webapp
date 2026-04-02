const pool = require('../../db/pool');

async function getTotalUsers() {
  const result = await pool.query('SELECT COUNT(*)::int AS total_users FROM users');
  return result.rows[0].total_users;
}

async function getBookingsPerMonth() {
  const result = await pool.query(
    `SELECT TO_CHAR(created_at, 'YYYY-MM') AS month, COUNT(*)::int AS total
     FROM bookings
     GROUP BY month
     ORDER BY month`,
  );
  return result.rows;
}

async function getRevenueGrowth() {
  const result = await pool.query(
    `SELECT TO_CHAR(b.created_at, 'YYYY-MM') AS month,
            COALESCE(SUM(COALESCE(b.final_price, p.price, 0)), 0)::numeric(10,2) AS revenue
     FROM bookings b
     LEFT JOIN travel_packages p ON p.id = b.package_id
     GROUP BY month
     ORDER BY month`,
  );
  return result.rows;
}

async function getPopularDestinations() {
  const result = await pool.query(
    `SELECT COALESCE(p.location, 'Unknown') AS destination, COUNT(*)::int AS total
     FROM bookings b
     LEFT JOIN travel_packages p ON p.id = b.package_id
     GROUP BY destination
     ORDER BY total DESC
     LIMIT 10`,
  );
  return result.rows;
}

async function getPackagePerformance() {
  const result = await pool.query(
    `SELECT p.id, p.title,
            COUNT(b.id)::int AS bookings,
            COALESCE(SUM(COALESCE(b.final_price, p.price, 0)), 0)::numeric(10,2) AS revenue
     FROM travel_packages p
     LEFT JOIN bookings b ON b.package_id = p.id
     GROUP BY p.id, p.title
     ORDER BY bookings DESC, revenue DESC
     LIMIT 10`,
  );
  return result.rows;
}

module.exports = {
  getTotalUsers,
  getBookingsPerMonth,
  getRevenueGrowth,
  getPopularDestinations,
  getPackagePerformance,
};
