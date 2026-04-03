const jsonServer = require('json-server');
const cookieParser = require('cookie-parser');
const path = require('path');
const { authMiddleware, VALID_TOKEN } = require('./middleware/auth');

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const PORT = 3001;

// Parse cookies before anything else
server.use(cookieParser());

// Allow cross-origin requests with credentials
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Parse JSON bodies
server.use(jsonServer.bodyParser);

// --- Custom auth routes ---

server.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const db = router.db.getState();
  const user = db.users.find((u) => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const { password: _pw, ...userWithoutPassword } = user;

  res.cookie('auth_token', VALID_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    path: '/',
  });

  return res.status(200).json({ user: userWithoutPassword });
});

server.post('/api/logout', (_req, res) => {
  res.clearCookie('auth_token', { path: '/' });
  return res.status(200).json({ message: 'Logged out successfully' });
});

server.get('/api/me', (req, res) => {
  const token = req.cookies && req.cookies.auth_token;

  if (!token || token !== VALID_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const db = router.db.getState();
  const user = db.users[0];
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { password: _pw, ...userWithoutPassword } = user;
  return res.status(200).json({ user: userWithoutPassword });
});

// --- json-server defaults and router ---

server.use(middlewares);

// Rewrite routes: /api/* -> /*
server.use('/api', authMiddleware, router);

server.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});
