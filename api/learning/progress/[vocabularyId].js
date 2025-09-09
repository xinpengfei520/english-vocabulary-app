// Mock learning progress data
let learningProgress = [];

const vocabularyList = [
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
    const { vocabularyId } = req.query;
    const progressData = req.body;
    
    if (!vocabularyId) {
      return res.status(400).json({ message: 'Vocabulary ID is required' });
    }

    // Find existing progress or create new one
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

    // Update progress with new data
    Object.assign(progress, progressData, {
      updatedAt: new Date()
    });

    console.log('Progress updated:', { vocabularyId, progress });

    return res.status(200).json(progress);
  } catch (error) {
    console.error('Update progress error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};