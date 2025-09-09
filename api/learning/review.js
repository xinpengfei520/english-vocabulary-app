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
    const now = new Date();
    
    // Find words that are due for review
    const wordsForReview = learningProgress
      .filter(progress => {
        return new Date(progress.nextReviewAt) <= now;
      })
      .map(progress => {
        const vocabulary = vocabularyList.find(v => v.id === progress.vocabularyId);
        return {
          ...vocabulary,
          progress: {
            masteryLevel: progress.masteryLevel,
            studyCount: progress.studyCount,
            correctCount: progress.correctCount
          }
        };
      })
      .filter(Boolean); // Remove any undefined entries

    // If no words are due for review, return some random words for practice
    if (wordsForReview.length === 0) {
      const randomWords = vocabularyList
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(vocabulary => ({
          ...vocabulary,
          progress: {
            masteryLevel: 0,
            studyCount: 0,
            correctCount: 0
          }
        }));
      
      return res.status(200).json(randomWords);
    }

    return res.status(200).json(wordsForReview);
  } catch (error) {
    console.error('Get review words error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};