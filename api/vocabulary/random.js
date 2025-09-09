const vocabularyList = require('../vocabulary-data.js');

// Mock learning progress data
let learningProgress = [];

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
    const { count = 10, exclude = '' } = req.query;
    
    // Get list of vocabulary IDs to exclude
    const excludeIds = exclude ? exclude.split(',') : [];
    
    // Filter out already studied words
    const availableWords = vocabularyList.filter(word => !excludeIds.includes(word.id));
    
    // If we don't have enough available words, use all words
    const wordsToUse = availableWords.length >= parseInt(count) ? availableWords : vocabularyList;
    
    // Get random words
    const randomWords = wordsToUse
      .sort(() => 0.5 - Math.random())
      .slice(0, parseInt(count));
    
    console.log(`Returning ${randomWords.length} random words, excluded ${excludeIds.length} words`);
    
    return res.status(200).json(randomWords);
  } catch (error) {
    console.error('Random words error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};