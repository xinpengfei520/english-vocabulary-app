const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock database
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
    word: 'adventure',
    pronunciation: '/ədˈventʃər/',
    definition: 'an unusual and exciting or daring experience',
    translation: '冒险',
    difficulty: 'medium',
    category: 'general',
    examples: [
      {
        sentence: 'The adventure changed their lives forever.',
        translation: '这次冒险永远改变了他们的生活。',
        context: 'life-changing experience'
      }
    ],
  },
  {
    id: '2',
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
    id: '3',
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
const JWT_SECRET = 'your-secret-key';

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

// Auth routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, user: { ...user, password: undefined } });
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
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
  res.json({ token, user: { ...newUser, password: undefined } });
});

// Protected routes
app.get('/api/users/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json({ ...user, password: undefined });
});

// Vocabulary routes
app.get('/api/vocabulary', (req, res) => {
  const { category, difficulty, page = 1, limit = 10 } = req.query;
  let filtered = vocabularyList;

  if (category) {
    filtered = filtered.filter(v => v.category === category);
  }

  if (difficulty) {
    filtered = filtered.filter(v => v.difficulty === difficulty);
  }

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  res.json({
    data: paginated,
    total: filtered.length,
  });
});

app.get('/api/vocabulary/random', (req, res) => {
  const { count = 10 } = req.query;
  const shuffled = [...vocabularyList].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, parseInt(count));
  res.json(selected);
});

app.get('/api/vocabulary/search', (req, res) => {
  const { query } = req.query;
  const results = vocabularyList.filter(v => 
    v.word.toLowerCase().includes(query.toLowerCase()) ||
    v.translation.toLowerCase().includes(query.toLowerCase())
  );
  res.json(results);
});

// Learning routes
app.get('/api/learning/progress', authenticateToken, (req, res) => {
  const userProgress = learningProgress.filter(p => p.userId === req.user.userId);
  res.json(userProgress);
});

app.post('/api/learning/study', authenticateToken, (req, res) => {
  const { vocabularyId, isCorrect } = req.body;
  
  let progress = learningProgress.find(p => 
    p.userId === req.user.userId && p.vocabularyId === vocabularyId
  );

  if (!progress) {
    progress = {
      id: Date.now().toString(),
      userId: req.user.userId,
      vocabularyId,
      masteryLevel: 0,
      lastStudied: new Date(),
      nextReview: new Date(),
      correctCount: 0,
      incorrectCount: 0,
      studyTime: 0,
    };
    learningProgress.push(progress);
  }

  if (isCorrect) {
    progress.correctCount++;
    progress.masteryLevel = Math.min(1, progress.masteryLevel + 0.1);
  } else {
    progress.incorrectCount++;
    progress.masteryLevel = Math.max(0, progress.masteryLevel - 0.05);
  }

  progress.lastStudied = new Date();
  progress.studyTime += 1;

  res.json(progress);
});

// Game routes
app.get('/api/games/leaderboard', (req, res) => {
  const { type = 'weekly' } = req.query;
  const mockLeaderboard = users.map(u => ({
    ...u,
    password: undefined,
    score: Math.floor(Math.random() * 1000),
    experience: u.experience + Math.floor(Math.random() * 1000),
  })).sort((a, b) => b.score - a.score);
  
  res.json(mockLeaderboard);
});

// Achievement routes
app.get('/api/achievements', (req, res) => {
  const achievements = [
    {
      id: '1',
      name: '初学者',
      description: '完成第一个单词学习',
      icon: '🎯',
      requirement: 'learn_first_word',
      points: 10,
      rarity: 'common',
    },
    {
      id: '2',
      name: '连续学习',
      description: '连续学习7天',
      icon: '🔥',
      requirement: 'streak_7_days',
      points: 50,
      rarity: 'rare',
    },
    {
      id: '3',
      name: '词汇大师',
      description: '掌握1000个单词',
      icon: '👑',
      requirement: 'master_1000_words',
      points: 200,
      rarity: 'legendary',
    },
  ];
  
  res.json(achievements);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});