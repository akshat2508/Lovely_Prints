import supabaseService from '../services/supabase.service.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authorization token missing',
      });
    }

    const token = authHeader.split(' ')[1];

    const { data, error } = await supabaseService.getUserFromToken(token);

    if (error || !data?.user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // 🔴 THIS IS THE KEY
    req.user = data.user;

    next();
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;
