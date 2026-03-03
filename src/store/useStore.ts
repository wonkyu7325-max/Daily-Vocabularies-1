import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Word } from '../data/words';

export type PracticeMode = 'zh-to-en' | 'en-to-zh';

interface MistakeRecord {
  wordId: string;
  wrongCount: number;
  lastWrongTime: number;
  consecutiveCorrect: number; // For spaced repetition (needs 3 to remove)
}

interface DailyProgress {
  date: string; // YYYY-MM-DD
  completedWords: number;
  wrongWords: number;
  totalAttempted: number;
}

interface AppState {
  // Settings
  practiceMode: PracticeMode;
  setPracticeMode: (mode: PracticeMode) => void;
  voiceVolume: number;
  setVoiceVolume: (vol: number) => void;
  praiseVolume: number;
  setPraiseVolume: (vol: number) => void;

  // Mistakes
  mistakes: Record<string, MistakeRecord>;
  addMistake: (wordId: string) => void;
  recordMistakeCorrect: (wordId: string) => void; // Increment consecutive correct, remove if >= 3
  removeMistake: (wordId: string) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (wordId: string) => void;

  // Daily Progress
  dailyProgress: Record<string, DailyProgress>;
  updateDailyProgress: (date: string, isCorrect: boolean) => void;
  
  // Learning Time
  totalLearningMinutes: number;
  lastLearningDate: string;
  addLearningTime: (minutes: number) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      practiceMode: 'zh-to-en',
      setPracticeMode: (mode) => set({ practiceMode: mode }),
      voiceVolume: 1,
      setVoiceVolume: (vol) => set({ voiceVolume: vol }),
      praiseVolume: 1,
      setPraiseVolume: (vol) => set({ praiseVolume: vol }),

      mistakes: {},
      addMistake: (wordId) => set((state) => {
        const existing = state.mistakes[wordId];
        return {
          mistakes: {
            ...state.mistakes,
            [wordId]: {
              wordId,
              wrongCount: (existing?.wrongCount || 0) + 1,
              lastWrongTime: Date.now(),
              consecutiveCorrect: 0, // Reset on wrong
            }
          }
        };
      }),
      recordMistakeCorrect: (wordId) => set((state) => {
        const existing = state.mistakes[wordId];
        if (!existing) return state;
        
        const newConsecutive = existing.consecutiveCorrect + 1;
        if (newConsecutive >= 3) {
          // Remove if mastered
          const newMistakes = { ...state.mistakes };
          delete newMistakes[wordId];
          return { mistakes: newMistakes };
        }
        
        return {
          mistakes: {
            ...state.mistakes,
            [wordId]: {
              ...existing,
              consecutiveCorrect: newConsecutive
            }
          }
        };
      }),
      removeMistake: (wordId) => set((state) => {
        const newMistakes = { ...state.mistakes };
        delete newMistakes[wordId];
        return { mistakes: newMistakes };
      }),

      favorites: [],
      toggleFavorite: (wordId) => set((state) => ({
        favorites: state.favorites.includes(wordId)
          ? state.favorites.filter(id => id !== wordId)
          : [...state.favorites, wordId]
      })),

      dailyProgress: {},
      updateDailyProgress: (date, isCorrect) => set((state) => {
        const existing = state.dailyProgress[date] || { date, completedWords: 0, wrongWords: 0, totalAttempted: 0 };
        return {
          dailyProgress: {
            ...state.dailyProgress,
            [date]: {
              ...existing,
              completedWords: isCorrect ? existing.completedWords + 1 : existing.completedWords,
              wrongWords: !isCorrect ? existing.wrongWords + 1 : existing.wrongWords,
              totalAttempted: existing.totalAttempted + 1
            }
          }
        };
      }),

      totalLearningMinutes: 0,
      lastLearningDate: '',
      addLearningTime: (minutes) => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        if (state.lastLearningDate !== today) {
          return { totalLearningMinutes: minutes, lastLearningDate: today };
        }
        return { totalLearningMinutes: state.totalLearningMinutes + minutes };
      })
    }),
    {
      name: 'zhanzhanlish-storage',
    }
  )
);
