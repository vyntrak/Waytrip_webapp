const pool = require('../../db/pool');

async function createDestinationAdmin({ name, country, description, heroImage, bestTime, currency }) {
  const result = await pool.query(
    `INSERT INTO destinations (name, country, description, hero_image, best_time, currency)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, country || null, description || null, heroImage || null, bestTime || null, currency || null],
  );
  return result.rows[0];
}

async function createPackageAdmin({ title, location, description, price, durationDays, coverImage }) {
  const result = await pool.query(
    `INSERT INTO travel_packages (title, location, description, price, duration_days, cover_image)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [title, location || null, description || null, price, durationDays || null, coverImage || null],
  );
  return result.rows[0];
}

async function listUsersAdmin() {
  const result = await pool.query(
    `SELECT id, first_name, last_name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`,
  );
  return result.rows;
}

async function listBookingsAdmin() {
  const result = await pool.query(
    `SELECT b.id, b.status, b.created_at,
            u.id as user_id, u.first_name, u.last_name, u.email,
            p.id as package_id, p.title as package_title, p.price as package_price
     FROM bookings b
     JOIN users u ON u.id = b.user_id
     LEFT JOIN travel_packages p ON p.id = b.package_id
     ORDER BY b.created_at DESC`,
  );
  return result.rows;
}

async function createNotificationAdmin({ title, message, audience = 'all', sentBy, targetUserId = null }) {
  const result = await pool.query(
    `INSERT INTO notifications (title, message, sent_by, audience, target_user_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, message, sentBy || null, audience, targetUserId],
  );
  return result.rows[0];
}

async function listNotificationsAdmin() {
  const result = await pool.query('SELECT * FROM notifications ORDER BY created_at DESC');
  return result.rows;
}

async function attachNotificationToUsers(notificationId, audience, targetUserId = null) {
  if (audience === 'single') {
    await pool.query(
      `INSERT INTO user_notifications (notification_id, user_id)
       VALUES ($1, $2)`,
      [notificationId, targetUserId],
    );
    return;
  }

  await pool.query(
    `INSERT INTO user_notifications (notification_id, user_id)
     SELECT $1, id FROM users`,
    [notificationId],
  );
}

async function createOfferAdmin({ title, couponCode, discountPercentage, packageId, expiryDate }) {
  const result = await pool.query(
    `INSERT INTO offers (title, coupon_code, discount_percentage, package_id, expiry_date)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [title, couponCode, discountPercentage, packageId, expiryDate],
  );
  return result.rows[0];
}

async function getWebsiteSettingsAdmin() {
  const result = await pool.query('SELECT * FROM website_settings WHERE id = 1');
  return result.rows[0] || null;
}

async function updateWebsiteSettingsAdmin({
  homepageBanners,
  featuredDestinations,
  sectionToggles,
  promotionalContent,
  menuLinks,
}) {
  const result = await pool.query(
    `UPDATE website_settings
     SET homepage_banners = COALESCE($1::jsonb, homepage_banners),
         featured_destinations = COALESCE($2::jsonb, featured_destinations),
         section_toggles = COALESCE($3::jsonb, section_toggles),
         promotional_content = COALESCE($4::jsonb, promotional_content),
         menu_links = COALESCE($5::jsonb, menu_links),
         updated_at = NOW()
     WHERE id = 1
     RETURNING *`,
    [
      homepageBanners ? JSON.stringify(homepageBanners) : null,
      featuredDestinations ? JSON.stringify(featuredDestinations) : null,
      sectionToggles ? JSON.stringify(sectionToggles) : null,
      promotionalContent ? JSON.stringify(promotionalContent) : null,
      menuLinks ? JSON.stringify(menuLinks) : null,
    ],
  );
  return result.rows[0] || null;
}

module.exports = {
  createDestinationAdmin,
  createPackageAdmin,
  listUsersAdmin,
  listBookingsAdmin,
  createNotificationAdmin,
  listNotificationsAdmin,
  attachNotificationToUsers,
  createOfferAdmin,
  getWebsiteSettingsAdmin,
  updateWebsiteSettingsAdmin,
};
