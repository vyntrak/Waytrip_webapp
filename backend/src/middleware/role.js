function requireRole(allowedRoles) {
  return function roleMiddleware(req, res, next) {
    const role = req.user && req.user.role;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role permissions' });
    }

    return next();
  };
}

module.exports = requireRole;
