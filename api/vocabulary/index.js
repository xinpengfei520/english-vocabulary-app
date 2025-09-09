const vocabularyList = require('../vocabulary-data.js');

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
    const { category, difficulty, page = 1, limit = 10 } = req.query;
    
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
    
    return res.status(200).json({
      data: paginatedVocabulary,
      total: filteredVocabulary.length
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};