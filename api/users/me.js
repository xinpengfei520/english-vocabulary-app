const jwt = require('jsonwebtoken');
const users = [
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

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({ ...user, password: undefined });
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};