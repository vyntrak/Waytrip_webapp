const pool = require('../../db/pool');

async function listDestinations() {
  const result = await pool.query('SELECT * FROM destinations ORDER BY id DESC');
  return result.rows;
}

async function getDestinationById(id) {
  const result = await pool.query('SELECT * FROM destinations WHERE id = $1', [id]);
  return result.rows[0] || null;
}

async function createDestination({ name, country, description, heroImage, bestTime, currency }) {
  const result = await pool.query(
    `INSERT INTO destinations (name, country, description, hero_image, best_time, currency)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, country || null, description || null, heroImage || null, bestTime || null, currency || null],
  );

  return result.rows[0];
}

async function updateDestination(id, { name, country, description, heroImage, bestTime, currency }) {
  const result = await pool.query(
    `UPDATE destinations
     SET name = $1,
         country = $2,
         description = $3,
         hero_image = $4,
         best_time = $5,
         currency = $6,
         updated_at = NOW()
     WHERE id = $7
     RETURNING *`,
    [name, country || null, description || null, heroImage || null, bestTime || null, currency || null, id],
  );

  return result.rows[0] || null;
}

async function deleteDestination(id) {
  const result = await pool.query('DELETE FROM destinations WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
}

module.exports = {
  listDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
};
