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

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { vocabularyId, isCorrect } = req.body;
    
    if (!vocabularyId || typeof isCorrect !== 'boolean') {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    // Find or create learning progress for this vocabulary
    let progress = learningProgress.find(p => p.vocabularyId === vocabularyId);
    
    if (!progress) {
      progress = {
        id: Date.now().toString(),
        vocabularyId,
        userId: '1', // Mock user ID
        studyCount: 0,
        correctCount: 0,
        lastStudiedAt: new Date(),
        masteryLevel: 0,
        nextReviewAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      learningProgress.push(progress);
    }

    // Update progress
    progress.studyCount += 1;
    if (isCorrect) {
      progress.correctCount += 1;
      progress.masteryLevel = Math.min(progress.masteryLevel + 1, 5);
    } else {
      progress.masteryLevel = Math.max(progress.masteryLevel - 1, 0);
    }
    
    progress.lastStudiedAt = new Date();
    progress.updatedAt = new Date();
    
    // Calculate next review time based on mastery level
    const reviewHours = [1, 3, 24, 72, 168, 336][progress.masteryLevel] || 1;
    progress.nextReviewAt = new Date(Date.now() + reviewHours * 60 * 60 * 1000);

    console.log('Study progress updated:', { vocabularyId, isCorrect, progress });

    return res.status(200).json({ 
      message: 'Study progress recorded',
      progress 
    });
  } catch (error) {
    console.error('Study progress error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};