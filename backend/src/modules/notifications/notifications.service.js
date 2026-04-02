const pool = require('../../db/pool');

async function getUserNotifications(userId) {
  const result = await pool.query(
    `SELECT un.id, un.is_read, un.read_at, un.created_at,
            n.title, n.message, n.audience
     FROM user_notifications un
     JOIN notifications n ON n.id = un.notification_id
     WHERE un.user_id = $1
     ORDER BY un.created_at DESC`,
    [userId],
  );
  return result.rows;
}

async function markNotificationRead(userNotificationId, userId) {
  const result = await pool.query(
    `UPDATE user_notifications
     SET is_read = TRUE,
         read_at = NOW()
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [userNotificationId, userId],
  );

  return result.rows[0] || null;
}

module.exports = {
  getUserNotifications,
  markNotificationRead,
};
