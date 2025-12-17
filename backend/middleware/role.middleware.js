// middleware/role.middleware.js

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.user_metadata?.role;

    if (!role) {
      return res.status(403).json({
        success: false,
        message: 'Role not assigned',
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    next();
  };
};

export default requireRole;
