const pool = require('../../db/pool');

async function listPackages() {
  const result = await pool.query('SELECT * FROM travel_packages ORDER BY id DESC');
  return result.rows;
}

async function createPackage({ title, location, description, price, durationDays, coverImage }) {
  const result = await pool.query(
    `INSERT INTO travel_packages (title, location, description, price, duration_days, cover_image)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, location || null, description || null, price, durationDays || null, coverImage || null],
  );

  return result.rows[0];
}

async function updatePackage(id, { title, location, description, price, durationDays, coverImage }) {
  const result = await pool.query(
    `UPDATE travel_packages
     SET title = $1,
         location = $2,
         description = $3,
         price = $4,
         duration_days = $5,
         cover_image = $6,
         updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [title, location || null, description || null, price, durationDays || null, coverImage || null, id],
  );

  return result.rows[0] || null;
}

async function deletePackage(id) {
  const result = await pool.query('DELETE FROM travel_packages WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
}

module.exports = {
  listPackages,
  createPackage,
  updatePackage,
  deletePackage,
};
