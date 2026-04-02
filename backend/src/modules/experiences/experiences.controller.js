const {
  getUserBooking,
  upsertExperience,
  getExperienceByBooking,
  listUserExperiences,
} = require('./experiences.service');

async function saveExperience(req, res) {
  const bookingId = Number(req.params.bookingId);
  if (!bookingId) {
    return res.status(400).json({ message: 'Invalid booking id' });
  }

  const ownedBooking = await getUserBooking(req.user.sub, bookingId);
  if (!ownedBooking) {
    return res.status(403).json({ message: 'You can only manage your own booking experiences' });
  }

  const experience = await upsertExperience({
    bookingId,
    timeline: req.body.timeline,
    dailyActivities: req.body.dailyActivities,
    travelTasks: req.body.travelTasks,
    memoryGallery: req.body.memoryGallery,
    achievementBadges: req.body.achievementBadges,
  });

  return res.status(200).json({ message: 'Experience saved', experience });
}

async function getExperience(req, res) {
  const bookingId = Number(req.params.bookingId);
  if (!bookingId) {
    return res.status(400).json({ message: 'Invalid booking id' });
  }

  const ownedBooking = await getUserBooking(req.user.sub, bookingId);
  if (!ownedBooking) {
    return res.status(403).json({ message: 'You can only view your own booking experiences' });
  }

  const experience = await getExperienceByBooking(bookingId);
  return res.status(200).json({ experience });
}

async function listMine(req, res) {
  const experiences = await listUserExperiences(req.user.sub);
  return res.status(200).json({ experiences });
}

module.exports = {
  saveExperience,
  getExperience,
  listMine,
};
