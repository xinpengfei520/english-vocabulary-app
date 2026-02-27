const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock database
const users = [
  {
    id: '1',
    username: 'vancexin',
    email: 'xinpengfei520@gmail.com',
    password: '$2b$08$aA5lE6pO.Xpzc552kuRpSOlqt5DaQI8w6rg05NPEGTZSMl5JG/t/2',
    level: 1,
    experience: 0,
    avatar: '',
    createdAt: new Date(),
    lastLoginAt: new Date(),
  },
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({ token, user: { ...user, password: undefined } });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};