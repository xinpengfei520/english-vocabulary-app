// Mock learning progress data
let learningProgress = [];
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
    const { vocabularyId } = req.query;
    
    let filteredProgress = learningProgress;
    
    if (vocabularyId) {
      filteredProgress = learningProgress.filter(p => p.vocabularyId === vocabularyId);
    }

    // If no progress exists, return empty array
    if (filteredProgress.length === 0) {
      return res.status(200).json([]);
    }

    // Enhance progress with vocabulary details
    const enhancedProgress = filteredProgress.map(progress => {
      const vocabulary = vocabularyList.find(v => v.id === progress.vocabularyId);
      return {
        ...progress,
        vocabulary: vocabulary || null
      };
    });

    return res.status(200).json(enhancedProgress);
  } catch (error) {
    console.error('Get progress error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};