const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../../db/pool');
const env = require('../../config/env');

async function registerUser({ firstName, lastName, email, password, role = 'traveler' }) {
  const normalizedEmail = email.toLowerCase().trim();

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
  if (existing.rows.length > 0) {
    return { error: 'Email already exists', status: 409 };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash, role)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, first_name, last_name, email, role, created_at`,
    [firstName, lastName, normalizedEmail, passwordHash, role],
  );

  return { user: result.rows[0] };
}

async function loginUser({ email, password }) {
  const normalizedEmail = email.toLowerCase().trim();

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [normalizedEmail]);
  if (result.rows.length === 0) {
    return { error: 'Invalid email or password', status: 401 };
  }

  const user = result.rows[0];
  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    return { error: 'Invalid email or password', status: 401 };
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn },
  );

  return {
    token,
    user: {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
  };
}

async function getUserById(userId) {
  const result = await pool.query(
    'SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = $1',
    [userId],
  );

  return result.rows[0] || null;
}

module.exports = {
  registerUser,
  loginUser,
  getUserById,
};
