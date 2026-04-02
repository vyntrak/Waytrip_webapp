const { getUserNotifications, markNotificationRead } = require('./notifications.service');

async function myNotifications(req, res) {
  const notifications = await getUserNotifications(req.user.sub);
  return res.status(200).json({ notifications });
}

async function readNotification(req, res) {
  const id = Number(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'Invalid notification id' });
  }

  const updated = await markNotificationRead(id, req.user.sub);
  if (!updated) {
    return res.status(404).json({ message: 'Notification not found' });
  }

  return res.status(200).json({ message: 'Notification marked as read' });
}

module.exports = {
  myNotifications,
  readNotification,
};
