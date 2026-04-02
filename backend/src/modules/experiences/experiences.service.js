const pool = require('../../db/pool');

async function getUserBooking(userId, bookingId) {
  const result = await pool.query('SELECT id FROM bookings WHERE id = $1 AND user_id = $2', [bookingId, userId]);
  return result.rows[0] || null;
}

async function upsertExperience({ bookingId, timeline, dailyActivities, travelTasks, memoryGallery, achievementBadges }) {
  const result = await pool.query(
    `INSERT INTO booking_experiences (booking_id, timeline, daily_activities, travel_tasks, memory_gallery, achievement_badges)
     VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb)
     ON CONFLICT (booking_id)
     DO UPDATE SET
       timeline = EXCLUDED.timeline,
       daily_activities = EXCLUDED.daily_activities,
       travel_tasks = EXCLUDED.travel_tasks,
       memory_gallery = EXCLUDED.memory_gallery,
       achievement_badges = EXCLUDED.achievement_badges,
       updated_at = NOW()
     RETURNING *`,
    [
      bookingId,
      timeline || '',
      JSON.stringify(dailyActivities || []),
      JSON.stringify(travelTasks || []),
      JSON.stringify(memoryGallery || []),
      JSON.stringify(achievementBadges || []),
    ],
  );
  return result.rows[0];
}

async function getExperienceByBooking(bookingId) {
  const result = await pool.query('SELECT * FROM booking_experiences WHERE booking_id = $1', [bookingId]);
  return result.rows[0] || null;
}

async function listUserExperiences(userId) {
  const result = await pool.query(
    `SELECT be.*, b.status, b.created_at AS booking_created_at,
            p.title AS package_title, p.location AS package_location
     FROM booking_experiences be
     JOIN bookings b ON b.id = be.booking_id
     LEFT JOIN travel_packages p ON p.id = b.package_id
     WHERE b.user_id = $1
     ORDER BY be.updated_at DESC`,
    [userId],
  );

  return result.rows;
}

module.exports = {
  getUserBooking,
  upsertExperience,
  getExperienceByBooking,
  listUserExperiences,
};
