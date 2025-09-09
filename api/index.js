const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock database - in production, use a real database
let users = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    password: '$2b$08$KmTO.t/GrqRxVxDO/s8.LuZOUNWtkmdWo9VbPvVUdt4eeXAJm.PAC',
    level: 1,
    experience: 0,
    avatar: '',
    createdAt: new Date(),
    lastLoginAt: new Date(),
  },
];

let vocabularyList = [
  {
    id: '1',
    word: 'knowledge',
    pronunciation: '/ˈnɒlɪdʒ/',
    definition: 'facts, information, and skills acquired through experience or education',
    translation: '知识',
    difficulty: 'easy',
    category: 'education',
    examples: [
      {
        sentence: 'Knowledge is power.',
        translation: '知识就是力量。',
        context: 'proverb'
      }
    ],
  },
  {
    id: '2',
    word: 'perseverance',
    pronunciation: '/ˌpɜːsɪˈvɪərəns/',
    definition: 'continued effort to do or achieve something despite difficulties',
    translation: '毅力',
    difficulty: 'hard',
    category: 'character',
    examples: [
      {
        sentence: 'Success requires perseverance and hard work.',
        translation: '成功需要毅力和努力工作。',
        context: 'success factors'
      }
    ],
  },
];

let learningProgress = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { method, url, body } = req;
  const parsedUrl = new URL(url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Health check
  if (pathname === '/api/health' && method === 'GET') {
    return res.json({ status: 'OK', timestamp: new Date().toISOString() });
  }

  // Login
  if (pathname === '/api/auth/login' && method === 'POST') {
    try {
      const { email, password } = JSON.parse(body);
      
      const user = users.find(u => u.email === email);
      if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, user: { ...user, password: undefined } });
    } catch (error) {
      return res.status(400).json({ message: 'Invalid request' });
    }
  }

  // Register
  if (pathname === '/api/auth/register' && method === 'POST') {
    try {
      const { username, email, password } = JSON.parse(body);
      
      if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password: bcrypt.hashSync(password, 8),
        level: 1,
        experience: 0,
        avatar: '',
        createdAt: new Date(),
        lastLoginAt: new Date(),
      };

      users.push(newUser);
      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, user: { ...newUser, password: undefined } });
    } catch (error) {
      return res.status(400).json({ message: 'Invalid request' });
    }
  }

  // Get current user
  if (pathname === '/api/users/me' && method === 'GET') {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'Access token required' });
      }

      const decoded = jwt.verify(token, JWT_SECRET);
      const user = users.find(u => u.id === decoded.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.json({ ...user, password: undefined });
    } catch (error) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  }

  // Get vocabulary list
  if (pathname === '/api/vocabulary' && method === 'GET') {
    try {
      const { category, difficulty, page = 1, limit = 10 } = parsedUrl.searchParams;
      
      let filteredVocabulary = vocabularyList;
      
      if (category) {
        filteredVocabulary = filteredVocabulary.filter(v => v.category === category);
      }
      
      if (difficulty) {
        filteredVocabulary = filteredVocabulary.filter(v => v.difficulty === difficulty);
      }
      
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedVocabulary = filteredVocabulary.slice(startIndex, endIndex);
      
      return res.json({
        data: paginatedVocabulary,
        total: filteredVocabulary.length
      });
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // Get random words
  if (pathname === '/api/vocabulary/random' && method === 'GET') {
    try {
      const { count = 10 } = parsedUrl.searchParams;
      const randomWords = vocabularyList.sort(() => 0.5 - Math.random()).slice(0, parseInt(count));
      return res.json(randomWords);
    } catch (error) {
      return res.status(500).json({ message: 'Server error' });
    }
  }

  // 404 for all other routes
  return res.status(404).json({ message: 'Route not found' });
};