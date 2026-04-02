const requireRole = require('../../middleware/role');
const {
  getTotalUsers,
  getBookingsPerMonth,
  getRevenueGrowth,
  getPopularDestinations,
  getPackagePerformance,
} = require('./analytics.service');

const analyticsRoleGuard = requireRole(['admin', 'super_admin', 'CRM_MANAGER']);

async function overview(req, res) {
  const [totalUsers, bookingsPerMonth, revenueGrowth, popularDestinations, packagePerformance] = await Promise.all([
    getTotalUsers(),
    getBookingsPerMonth(),
    getRevenueGrowth(),
    getPopularDestinations(),
    getPackagePerformance(),
  ]);

  return res.status(200).json({
    totalUsers,
    bookingsPerMonth,
    revenueGrowth,
    popularDestinations,
    packagePerformance,
  });
}

module.exports = {
  overview,
  analyticsRoleGuard,
};
