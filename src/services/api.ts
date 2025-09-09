import axios from 'axios';
import { User, Vocabulary, LearningProgress, GameSession, Achievement, StudyPlan, TestQuestion, TestResult } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const userService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me');
    return response.data as User;
  },
  
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put('/users/me', userData);
    return response.data as User;
  },
};

export const vocabularyService = {
  getVocabularyList: async (params?: { 
    category?: string; 
    difficulty?: string; 
    page?: number; 
    limit?: number;
  }): Promise<{ data: Vocabulary[]; total: number }> => {
    const response = await api.get('/vocabulary', { params });
    return response.data as { data: Vocabulary[]; total: number };
  },
  
  getVocabularyById: async (id: string): Promise<Vocabulary> => {
    const response = await api.get(`/vocabulary/${id}`);
    return response.data as Vocabulary;
  },
  
  getRandomWords: async (count: number = 10): Promise<Vocabulary[]> => {
    const response = await api.get('/vocabulary/random', { params: { count } });
    return response.data as Vocabulary[];
  },
  
  searchWords: async (query: string): Promise<Vocabulary[]> => {
    const response = await api.get('/vocabulary/search', { params: { query } });
    return response.data as Vocabulary[];
  },
};

export const learningService = {
  getProgress: async (vocabularyId?: string): Promise<LearningProgress[]> => {
    const params = vocabularyId ? { vocabularyId } : {};
    const response = await api.get('/learning/progress', { params });
    return response.data as LearningProgress[];
  },
  
  updateProgress: async (vocabularyId: string, progress: Partial<LearningProgress>): Promise<LearningProgress> => {
    const response = await api.post(`/learning/progress/${vocabularyId}`, progress);
    return response.data as LearningProgress;
  },
  
  getWordsForReview: async (): Promise<Vocabulary[]> => {
    const response = await api.get('/learning/review');
    return response.data as Vocabulary[];
  },
  
  markWordStudied: async (vocabularyId: string, isCorrect: boolean): Promise<void> => {
    await api.post('/learning/study', { vocabularyId, isCorrect });
  },
};

export const gameService = {
  startSession: async (type: 'adventure' | 'arena' | 'practice', level: number = 1): Promise<GameSession> => {
    const response = await api.post('/games/start', { type, level });
    return response.data as GameSession;
  },
  
  endSession: async (sessionId: string, score: number, correctAnswers: number, totalAnswers: number): Promise<GameSession> => {
    const response = await api.put(`/games/session/${sessionId}`, { score, correctAnswers, totalAnswers });
    return response.data as GameSession;
  },
  
  getLeaderboard: async (type: 'daily' | 'weekly' | 'all-time'): Promise<User[]> => {
    const response = await api.get('/games/leaderboard', { params: { type } });
    return response.data as User[];
  },
};

export const achievementService = {
  getAchievements: async (): Promise<Achievement[]> => {
    const response = await api.get('/achievements');
    return response.data as Achievement[];
  },
  
  getUserAchievements: async (): Promise<User[]> => {
    const response = await api.get('/achievements/user');
    return response.data as User[];
  },
  
  unlockAchievement: async (achievementId: string): Promise<void> => {
    await api.post(`/achievements/${achievementId}/unlock`);
  },
};

export const studyPlanService = {
  createPlan: async (plan: Omit<StudyPlan, 'id' | 'completedWords'>): Promise<StudyPlan> => {
    const response = await api.post('/study-plans', plan);
    return response.data as StudyPlan;
  },
  
  getPlans: async (): Promise<StudyPlan[]> => {
    const response = await api.get('/study-plans');
    return response.data as StudyPlan[];
  },
  
  updatePlan: async (planId: string, updates: Partial<StudyPlan>): Promise<StudyPlan> => {
    const response = await api.put(`/study-plans/${planId}`, updates);
    return response.data as StudyPlan;
  },
  
  deletePlan: async (planId: string): Promise<void> => {
    await api.delete(`/study-plans/${planId}`);
  },
};

export const testService = {
  generateTest: async (params: {
    difficulty?: string;
    questionCount?: number;
    questionTypes?: string[];
  }): Promise<TestQuestion[]> => {
    const response = await api.post('/tests/generate', params);
    return response.data as TestQuestion[];
  },
  
  submitTest: async (testId: string, answers: any[]): Promise<TestResult> => {
    const response = await api.post(`/tests/${testId}/submit`, { answers });
    return response.data as TestResult;
  },
  
  getTestResults: async (): Promise<TestResult[]> => {
    const response = await api.get('/tests/results');
    return response.data as TestResult[];
  },
};

export default api;