CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'traveler',
  phone VARCHAR(40),
  contact_notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

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

CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  package_id INTEGER REFERENCES travel_packages(id) ON DELETE SET NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'upcoming',
  notes TEXT,
  base_price NUMERIC(10,2),
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  final_price NUMERIC(10,2),
  coupon_code VARCHAR(60),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  message TEXT NOT NULL,
  sent_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
  audience VARCHAR(40) NOT NULL DEFAULT 'all',
  target_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_notifications (
  id SERIAL PRIMARY KEY,
  notification_id INTEGER NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180) NOT NULL,
  coupon_code VARCHAR(60) UNIQUE NOT NULL,
  discount_percentage NUMERIC(5,2) NOT NULL,
  package_id INTEGER REFERENCES travel_packages(id) ON DELETE CASCADE,
  expiry_date TIMESTAMP NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

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
