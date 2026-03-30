const pool = require('./pool');

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role VARCHAR(30) NOT NULL DEFAULT 'traveler',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS destinations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      country VARCHAR(120),
      description TEXT,
      hero_image TEXT,
      best_time VARCHAR(80),
      currency VARCHAR(80),
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    INSERT INTO destinations (name, country, description, hero_image, best_time, currency)
    SELECT
      'London',
      'United Kingdom',
      'Historic landmarks, modern neighborhoods, museums, and vibrant city life.',
      'src/images/pages/destinations/1.png',
      'May to September',
      'British Pound'
    WHERE NOT EXISTS (SELECT 1 FROM destinations);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS travel_packages (
      id SERIAL PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      location VARCHAR(160),
      description TEXT,
      price NUMERIC(10,2) NOT NULL DEFAULT 0,
      duration_days INTEGER,
      cover_image TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    INSERT INTO travel_packages (title, location, description, price, duration_days, cover_image)
    SELECT
      'London City Explorer',
      'London, United Kingdom',
      '4-day guided city package covering iconic landmarks and local experiences.',
      499.00,
      4,
      'src/images/hotels/1/1.png'
    WHERE NOT EXISTS (SELECT 1 FROM travel_packages);
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      package_id INTEGER REFERENCES travel_packages(id) ON DELETE SET NULL,
      status VARCHAR(40) NOT NULL DEFAULT 'upcoming',
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

module.exports = initializeDatabase;
