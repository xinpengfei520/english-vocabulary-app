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
  {
    id: '3',
    word: 'achievement',
    pronunciation: '/əˈtʃiːvmənt/',
    definition: 'something that has been accomplished through great effort',
    translation: '成就',
    difficulty: 'medium',
    category: 'success',
    examples: [
      {
        sentence: 'Graduating from college is a great achievement.',
        translation: '大学毕业是一个伟大的成就。',
        context: 'education'
      }
    ],
  },
  {
    id: '4',
    word: 'challenge',
    pronunciation: '/ˈtʃælɪndʒ/',
    definition: 'a difficult task that requires effort and skill',
    translation: '挑战',
    difficulty: 'medium',
    category: 'difficulty',
    examples: [
      {
        sentence: 'Learning a new language is a big challenge.',
        translation: '学习一门新语言是一个很大的挑战。',
        context: 'learning'
      }
    ],
  },
  {
    id: '5',
    word: 'determination',
    pronunciation: '/dɪˌtɜːmɪˈneɪʃn/',
    definition: 'firmness of purpose; resoluteness',
    translation: '决心',
    difficulty: 'hard',
    category: 'character',
    examples: [
      {
        sentence: 'Her determination helped her overcome all obstacles.',
        translation: '她的决心帮助她克服了所有障碍。',
        context: 'success story'
      }
    ],
  },
  {
    id: '6',
    word: 'excellent',
    pronunciation: '/ˈeksələnt/',
    definition: 'extremely good; outstanding',
    translation: '优秀的',
    difficulty: 'easy',
    category: 'quality',
    examples: [
      {
        sentence: 'She is an excellent student.',
        translation: '她是一个优秀的学生。',
        context: 'education'
      }
    ],
  },
  {
    id: '7',
    word: 'fantastic',
    pronunciation: '/fænˈtæstɪk/',
    definition: 'extraordinarily good; wonderful',
    translation: '极好的',
    difficulty: 'easy',
    category: 'emotion',
    examples: [
      {
        sentence: 'The movie was fantastic!',
        translation: '这部电影太棒了！',
        context: 'entertainment'
      }
    ],
  },
  {
    id: '8',
    word: 'generous',
    pronunciation: '/ˈdʒenərəs/',
    definition: 'willing to give and share freely',
    translation: '慷慨的',
    difficulty: 'medium',
    category: 'character',
    examples: [
      {
        sentence: 'He is very generous with his time.',
        translation: '他在时间方面很慷慨。',
        context: 'personality'
      }
    ],
  },
  {
    id: '9',
    word: 'happiness',
    pronunciation: '/ˈhæpinəs/',
    definition: 'the state of being happy; joy',
    translation: '幸福',
    difficulty: 'easy',
    category: 'emotion',
    examples: [
      {
        sentence: 'Money cannot buy happiness.',
        translation: '金钱买不到幸福。',
        context: 'life philosophy'
      }
    ],
  },
  {
    id: '10',
    word: 'imagination',
    pronunciation: '/ɪˌmædʒɪˈneɪʃn/',
    definition: 'the ability to form mental images or concepts',
    translation: '想象力',
    difficulty: 'medium',
    category: 'mind',
    examples: [
      {
        sentence: 'Children have vivid imaginations.',
        translation: '孩子们有丰富的想象力。',
        context: 'childhood'
      }
    ],
  },
  {
    id: '11',
    word: 'journey',
    pronunciation: '/ˈdʒɜːni/',
    definition: 'an act of traveling from one place to another',
    translation: '旅程',
    difficulty: 'easy',
    category: 'travel',
    examples: [
      {
        sentence: 'Life is a journey, not a destination.',
        translation: '人生是一段旅程，不是目的地。',
        context: 'philosophy'
      }
    ],
  },
  {
    id: '12',
    word: 'kindness',
    pronunciation: '/ˈkaɪndnəs/',
    definition: 'the quality of being friendly and considerate',
    translation: '善良',
    difficulty: 'easy',
    category: 'character',
    examples: [
      {
        sentence: 'Her kindness touched everyone\'s heart.',
        translation: '她的善良感动了每个人的心。',
        context: 'humanity'
      }
    ],
  },
  {
    id: '13',
    word: 'leadership',
    pronunciation: '/ˈliːdəʃɪp/',
    definition: 'the action of leading a group of people',
    translation: '领导力',
    difficulty: 'hard',
    category: 'skill',
    examples: [
      {
        sentence: 'Good leadership requires strong communication skills.',
        translation: '良好的领导力需要强大的沟通技巧。',
        context: 'management'
      }
    ],
  },
  {
    id: '14',
    word: 'motivation',
    pronunciation: '/ˌməʊtɪˈveɪʃn/',
    definition: 'the reason or reasons for acting or behaving in a particular way',
    translation: '动机',
    difficulty: 'medium',
    category: 'psychology',
    examples: [
      {
        sentence: 'Her motivation to succeed is inspiring.',
        translation: '她成功的动机鼓舞人心。',
        context: 'success'
      }
    ],
  },
  {
    id: '15',
    word: 'opportunity',
    pronunciation: '/ˌɒpəˈtjuːnəti/',
    definition: 'a set of circumstances that makes it possible to do something',
    translation: '机会',
    difficulty: 'medium',
    category: 'possibility',
    examples: [
      {
        sentence: 'Education provides opportunities for a better future.',
        translation: '教育为更好的未来提供机会。',
        context: 'career'
      }
    ],
  },
  {
    id: '16',
    word: 'patience',
    pronunciation: '/ˈpeɪʃns/',
    definition: 'the capacity to accept delay without getting angry',
    translation: '耐心',
    difficulty: 'medium',
    category: 'character',
    examples: [
      {
        sentence: 'Patience is a virtue.',
        translation: '耐心是一种美德。',
        context: 'proverb'
      }
    ],
  },
  {
    id: '17',
    word: 'quality',
    pronunciation: '/ˈkwɒləti/',
    definition: 'the standard of something as measured against other things',
    translation: '质量',
    difficulty: 'easy',
    category: 'standard',
    examples: [
      {
        sentence: 'Quality is more important than quantity.',
        translation: '质量比数量更重要。',
        context: 'business'
      }
    ],
  },
  {
    id: '18',
    word: 'responsibility',
    pronunciation: '/rɪˌspɒnsəˈbɪləti/',
    definition: 'the state of being accountable for something',
    translation: '责任',
    difficulty: 'hard',
    category: 'duty',
    examples: [
      {
        sentence: 'With great power comes great responsibility.',
        translation: '能力越大，责任越大。',
        context: 'ethics'
      }
    ],
  },
  {
    id: '19',
    word: 'success',
    pronunciation: '/səkˈses/',
    definition: 'the accomplishment of an aim or purpose',
    translation: '成功',
    difficulty: 'easy',
    category: 'achievement',
    examples: [
      {
        sentence: 'Success comes from hard work and persistence.',
        translation: '成功来自努力工作和坚持。',
        context: 'motivation'
      }
    ],
  },
  {
    id: '20',
    word: 'wisdom',
    pronunciation: '/ˈwɪzdəm/',
    definition: 'the quality of having experience, knowledge, and good judgment',
    translation: '智慧',
    difficulty: 'hard',
    category: 'mind',
    examples: [
      {
        sentence: 'Wisdom comes with age and experience.',
        translation: '智慧随着年龄和经验而来。',
        context: 'philosophy'
      }
    ],
  },
  {
    id: '21',
    word: 'enthusiasm',
    pronunciation: '/ɪnˈθjuːziæzəm/',
    definition: 'intense and eager enjoyment or interest',
    translation: '热情',
    difficulty: 'medium',
    category: 'emotion',
    examples: [
      {
        sentence: 'She shows great enthusiasm for her work.',
        translation: '她对工作表现出极大的热情。',
        context: 'career'
      }
    ],
  },
  {
    id: '22',
    word: 'creativity',
    pronunciation: '/ˌkriːeɪˈtɪvəti/',
    definition: 'the use of imagination to create new ideas',
    translation: '创造力',
    difficulty: 'medium',
    category: 'skill',
    examples: [
      {
        sentence: 'Creativity is essential for innovation.',
        translation: '创造力对创新至关重要。',
        context: 'innovation'
      }
    ],
  },
  {
    id: '23',
    word: 'confidence',
    pronunciation: '/ˈkɒnfɪdəns/',
    definition: 'the feeling of self-assurance arising from appreciation of one\'s abilities',
    translation: '自信',
    difficulty: 'medium',
    category: 'emotion',
    examples: [
      {
        sentence: 'Confidence is key to success.',
        translation: '自信是成功的关键。',
        context: 'self-improvement'
      }
    ],
  },
  {
    id: '24',
    word: 'discipline',
    pronunciation: '/ˈdɪsəplɪn/',
    definition: 'the practice of training people to obey rules',
    translation: '纪律',
    difficulty: 'hard',
    category: 'behavior',
    examples: [
      {
        sentence: 'Self-discipline leads to success.',
        translation: '自律带来成功。',
        context: 'self-improvement'
      }
    ],
  },
  {
    id: '25',
    word: 'courage',
    pronunciation: '/ˈkʌrɪdʒ/',
    definition: 'the ability to do something that frightens one',
    translation: '勇气',
    difficulty: 'medium',
    category: 'character',
    examples: [
      {
        sentence: 'It takes courage to admit mistakes.',
        translation: '承认错误需要勇气。',
        context: 'morality'
      }
    ],
  }
];

module.exports = vocabularyList;