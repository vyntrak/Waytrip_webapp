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

  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(40);`);
  await pool.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS contact_notes TEXT;`);

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

  await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS notes TEXT;`);
  await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS base_price NUMERIC(10,2);`);
  await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC(5,2) DEFAULT 0;`);
  await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS final_price NUMERIC(10,2);`);
  await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS coupon_code VARCHAR(60);`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id SERIAL PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      message TEXT NOT NULL,
      sent_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
      audience VARCHAR(40) NOT NULL DEFAULT 'all',
      target_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_notifications (
      id SERIAL PRIMARY KEY,
      notification_id INTEGER NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      read_at TIMESTAMP,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS offers (
      id SERIAL PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      coupon_code VARCHAR(60) UNIQUE NOT NULL,
      discount_percentage NUMERIC(5,2) NOT NULL,
      package_id INTEGER REFERENCES travel_packages(id) ON DELETE CASCADE,
      expiry_date TIMESTAMP NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS booking_experiences (
      id SERIAL PRIMARY KEY,
      booking_id INTEGER UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      timeline TEXT,
      daily_activities JSONB NOT NULL DEFAULT '[]'::jsonb,
      travel_tasks JSONB NOT NULL DEFAULT '[]'::jsonb,
      memory_gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
      achievement_badges JSONB NOT NULL DEFAULT '[]'::jsonb,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS website_settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      homepage_banners JSONB NOT NULL DEFAULT '[]'::jsonb,
      featured_destinations JSONB NOT NULL DEFAULT '[]'::jsonb,
      section_toggles JSONB NOT NULL DEFAULT '{}'::jsonb,
      promotional_content JSONB NOT NULL DEFAULT '[]'::jsonb,
      menu_links JSONB NOT NULL DEFAULT '[]'::jsonb,
      updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT website_settings_single_row CHECK (id = 1)
    );
  `);

  await pool.query(`
    INSERT INTO website_settings (id)
    VALUES (1)
    ON CONFLICT (id) DO NOTHING;
  `);
}

module.exports = initializeDatabase;
