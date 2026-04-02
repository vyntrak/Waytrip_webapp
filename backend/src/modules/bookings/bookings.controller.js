const {
  createBooking,
  listUserBookings,
  getPackageById,
  getValidOfferByCode,
} = require('./bookings.service');

async function create(req, res) {
  const userId = req.user.sub;
  const { packageId, couponCode } = req.body;

  if (packageId !== undefined && Number.isNaN(Number(packageId))) {
    return res.status(400).json({ message: 'packageId must be a number' });
  }

  const parsedPackageId = packageId ? Number(packageId) : null;
  let basePrice = null;
  let discountPercentage = 0;
  let finalPrice = null;
  let normalizedCoupon = null;

  if (parsedPackageId) {
    const selectedPackage = await getPackageById(parsedPackageId);
    if (!selectedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    basePrice = Number(selectedPackage.price || 0);
    finalPrice = basePrice;

    if (couponCode) {
      const offer = await getValidOfferByCode(couponCode, parsedPackageId);
      if (!offer) {
        return res.status(400).json({ message: 'Invalid or expired coupon code' });
      }

      discountPercentage = Number(offer.discount_percentage || 0);
      finalPrice = Number((basePrice - (basePrice * discountPercentage) / 100).toFixed(2));
      normalizedCoupon = String(couponCode).trim().toUpperCase();
    }
  }

  const booking = await createBooking({
    userId,
    packageId: parsedPackageId,
    couponCode: normalizedCoupon,
    basePrice,
    discountPercentage,
    finalPrice,
  });

  return res.status(201).json({
    message: 'Booking created successfully',
    booking,
  });
}

async function getMine(req, res) {
  const userId = req.user.sub;
  const bookings = await listUserBookings(userId);
  return res.status(200).json({ bookings });
}

module.exports = {
  create,
  getMine,
};
