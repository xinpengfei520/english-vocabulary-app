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