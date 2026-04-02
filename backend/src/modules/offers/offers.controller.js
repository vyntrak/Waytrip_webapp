const { listActiveOffers, findValidOffer } = require('./offers.service');

async function getOffers(req, res) {
  const offers = await listActiveOffers();
  return res.status(200).json({ offers });
}

async function validateOffer(req, res) {
  const couponCode = req.query.code;
  const packageId = Number(req.query.packageId);

  if (!couponCode || !packageId) {
    return res.status(400).json({ message: 'code and packageId are required' });
  }

  const offer = await findValidOffer(couponCode, packageId);
  if (!offer) {
    return res.status(404).json({ message: 'Offer not valid' });
  }

  return res.status(200).json({ offer });
}

module.exports = {
  getOffers,
  validateOffer,
};
