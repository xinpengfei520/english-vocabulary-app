export interface User {
  id: string;
  username: string;
  email: string;
  level: number;
  experience: number;
  avatar: string;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface Vocabulary {
  id: string;
  word: string;
  pronunciation: string;
  definition: string;
  translation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  examples: Example[];
  imageUrl?: string;
  audioUrl?: string;
}

export interface Example {
  sentence: string;
  translation: string;
  context: string;
}

export interface LearningProgress {
  id: string;
  userId: string;
  vocabularyId: string;
  masteryLevel: number;
  lastStudied: Date;
  nextReview: Date;
  correctCount: number;
  incorrectCount: number;
  studyTime: number;
}

export interface GameSession {
  id: string;
  userId: string;
  type: 'adventure' | 'arena' | 'practice';
  level: number;
  score: number;
  timeSpent: number;
  correctAnswers: number;
  totalAnswers: number;
  completedAt: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  memberCount: number;
  createdAt: Date;
  isPrivate: boolean;
}

export interface StudyPlan {
  id: string;
  userId: string;
  name: string;
  targetWords: number;
  dailyGoal: number;
  startDate: Date;
  endDate: Date;
  completedWords: number;
  isActive: boolean;
}

export interface TestQuestion {
  id: string;
  vocabularyId: string;
  type: 'multiple-choice' | 'fill-blank' | 'translation' | 'listening';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  completedAt: Date;
  answers: TestAnswer[];
}

export interface TestAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number;
}