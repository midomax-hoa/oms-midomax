const VALID_TOKEN = 'mock-auth-token-midomax-2026';

function authMiddleware(req, res, next) {
  const publicPaths = ['/api/login', '/api/logout'];
  if (publicPaths.includes(req.path)) {
    return next();
  }

  const token = req.cookies && req.cookies.auth_token;
  if (!token || token !== VALID_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}

module.exports = { authMiddleware, VALID_TOKEN };
