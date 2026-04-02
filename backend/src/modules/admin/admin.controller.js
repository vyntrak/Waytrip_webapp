const {
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
} = require('./admin.service');

async function addDestination(req, res) {
  const { name, country, description, heroImage, bestTime, currency } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'name is required' });
  }

  const destination = await createDestinationAdmin({
    name,
    country,
    description,
    heroImage,
    bestTime,
    currency,
  });

  return res.status(201).json({ message: 'Destination created', destination });
}

async function addPackage(req, res) {
  const { title, location, description, price, durationDays, coverImage } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'title is required' });
  }

  if (price === undefined || Number.isNaN(Number(price))) {
    return res.status(400).json({ message: 'price must be a valid number' });
  }

  const travelPackage = await createPackageAdmin({
    title,
    location,
    description,
    price: Number(price),
    durationDays,
    coverImage,
  });

  return res.status(201).json({ message: 'Package created', package: travelPackage });
}

async function getUsers(req, res) {
  const users = await listUsersAdmin();
  return res.status(200).json({ users });
}

async function getBookings(req, res) {
  const bookings = await listBookingsAdmin();
  return res.status(200).json({ bookings });
}

async function sendNotification(req, res) {
  const { title, message, audience = 'all', userId } = req.body;

  if (!title || !message) {
    return res.status(400).json({ message: 'title and message are required' });
  }

  if (!['all', 'single'].includes(audience)) {
    return res.status(400).json({ message: 'audience must be all or single' });
  }

  if (audience === 'single' && !userId) {
    return res.status(400).json({ message: 'userId is required for single audience' });
  }

  const notification = await createNotificationAdmin({
    title,
    message,
    audience,
    sentBy: req.user.sub,
    targetUserId: audience === 'single' ? Number(userId) : null,
  });
  await attachNotificationToUsers(
    notification.id,
    audience,
    audience === 'single' ? Number(userId) : null,
  );

  return res.status(201).json({ message: 'Notification sent', notification });
}

async function getNotifications(req, res) {
  const notifications = await listNotificationsAdmin();
  return res.status(200).json({ notifications });
}

async function createOffer(req, res) {
  const { title, couponCode, discountPercentage, packageId, expiryDate } = req.body;

  if (!title || !couponCode || discountPercentage === undefined || !packageId || !expiryDate) {
    return res.status(400).json({
      message: 'title, couponCode, discountPercentage, packageId and expiryDate are required',
    });
  }

  const parsedDiscount = Number(discountPercentage);
  if (Number.isNaN(parsedDiscount) || parsedDiscount <= 0 || parsedDiscount > 100) {
    return res.status(400).json({ message: 'discountPercentage must be between 0 and 100' });
  }

  const offer = await createOfferAdmin({
    title,
    couponCode: String(couponCode).trim().toUpperCase(),
    discountPercentage: parsedDiscount,
    packageId: Number(packageId),
    expiryDate,
  });

  return res.status(201).json({ message: 'Offer created', offer });
}

async function getWebsiteSettings(req, res) {
  const settings = await getWebsiteSettingsAdmin();
  return res.status(200).json({ settings });
}

async function updateWebsiteSettings(req, res) {
  const settings = await updateWebsiteSettingsAdmin({
    homepageBanners: req.body.homepageBanners,
    featuredDestinations: req.body.featuredDestinations,
    sectionToggles: req.body.sectionToggles,
    promotionalContent: req.body.promotionalContent,
    menuLinks: req.body.menuLinks,
  });

  return res.status(200).json({ message: 'Website settings updated', settings });
}

module.exports = {
  addDestination,
  addPackage,
  getUsers,
  getBookings,
  sendNotification,
  getNotifications,
  createOffer,
  getWebsiteSettings,
  updateWebsiteSettings,
};
