import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { WORDS, Word, PartOfSpeech } from '../data/words';
import confetti from 'canvas-confetti';
import { Play, CheckSquare } from 'lucide-react';
import { playCorrectSound } from '../utils/audio';

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Generate daily 50 words
function getDailyWords(): Word[] {
  const nouns = shuffle(WORDS.filter(w => w.partOfSpeech === 'n.')).slice(0, 20);
  const verbs = shuffle(WORDS.filter(w => w.partOfSpeech === 'v.')).slice(0, 15);
  const adjs = shuffle(WORDS.filter(w => w.partOfSpeech === 'adj.')).slice(0, 10);
  const advs = shuffle(WORDS.filter(w => w.partOfSpeech === 'adv.')).slice(0, 5);
  return [...nouns, ...verbs, ...adjs, ...advs];
}

export default function Home() {
  const { practiceMode, addMistake, updateDailyProgress } = useStore();
  const [dailyWords, setDailyWords] = useState<Word[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Word[]>([]);
  const [groupIndex, setGroupIndex] = useState(0); // 0 to 9 (10 groups of 5)
  const [wordIndex, setWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [wrongWordsQueue, setWrongWordsQueue] = useState<Word[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [finalReviewMode, setFinalReviewMode] = useState(false);
  const [finalReviewWords, setFinalReviewWords] = useState<Word[]>([]);

  useEffect(() => {
    // Initialize daily words
    const words = getDailyWords();
    setDailyWords(words);
    setCurrentGroup(words.slice(0, 5));
  }, []);

  const currentWord = finalReviewMode ? finalReviewWords[wordIndex] : currentGroup[wordIndex];

  const handleNextGroup = () => {
    if (groupIndex < 9) {
      const nextGroupIndex = groupIndex + 1;
      setGroupIndex(nextGroupIndex);
      setCurrentGroup(dailyWords.slice(nextGroupIndex * 5, (nextGroupIndex + 1) * 5));
      setWordIndex(0);
      setWrongWordsQueue([]);
    } else {
      // All 50 words done, start final review if there are mistakes
      const allMistakes = useStore.getState().mistakes;
      const todayMistakes = Object.values(allMistakes)
        .filter(m => {
          const today = new Date().setHours(0,0,0,0);
          return m.lastWrongTime > today;
        })
        .map(m => WORDS.find(w => w.id === m.wordId)!)
        .filter(Boolean);

      if (todayMistakes.length > 0) {
        setFinalReviewMode(true);
        setFinalReviewWords(todayMistakes);
        setWordIndex(0);
      } else {
        setIsFinished(true);
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const checkAnswer = () => {
    if (!currentWord || !inputValue.trim()) return;

    const isZhToEn = practiceMode === 'zh-to-en';
    let isCorrect = false;

    if (isZhToEn) {
      isCorrect = inputValue.trim() === currentWord.word;
    } else {
      // En to Zh: check if input matches any translation or synonym loosely
      const validAnswers = [...currentWord.translation, ...currentWord.synonyms];
      isCorrect = validAnswers.some(ans => inputValue.trim().includes(ans) || ans.includes(inputValue.trim()));
    }

    const today = new Date().toISOString().split('T')[0];
    updateDailyProgress(today, isCorrect);

    if (isCorrect) {
      playCorrectSound();
      setFeedback({ type: 'success', message: '正确！继续加油💪' });
      setConsecutiveCorrect(prev => {
        const newCount = prev + 1;
        if (newCount === 5) {
          // Show medal/confetti
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
        }
        return newCount;
      });

      setTimeout(() => {
        setFeedback({ type: null, message: '' });
        setInputValue('');
        
        if (finalReviewMode) {
          if (wordIndex < finalReviewWords.length - 1) {
            setWordIndex(wordIndex + 1);
          } else {
            setIsFinished(true);
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          }
        } else {
          if (wrongWordsQueue.length > 0) {
            // Pop from wrong words queue
            const nextWrong = wrongWordsQueue[0];
            setWrongWordsQueue(prev => prev.slice(1));
            // Find its index in current group to update wordIndex, or just handle it differently
            // Actually, better to just append to currentGroup
            setCurrentGroup(prev => [...prev, nextWrong]);
            setWordIndex(wordIndex + 1);
          } else if (wordIndex < currentGroup.length - 1) {
            setWordIndex(wordIndex + 1);
          } else {
            handleNextGroup();
          }
        }
      }, 1000);

    } else {
      setFeedback({ 
        type: 'error', 
        message: `再试一次～ 正确答案：${isZhToEn ? currentWord.word : currentWord.translation.join(' / ')} (${currentWord.partOfSpeech})` 
      });
      setConsecutiveCorrect(0);
      addMistake(currentWord.id);

      if (!finalReviewMode) {
        // Add to queue twice for repetition
        setWrongWordsQueue(prev => [...prev, currentWord, currentWord]);
      }

      setTimeout(() => {
        setFeedback({ type: null, message: '' });
        setInputValue('');
        // If wrong, we stay on the same word or move to next and repeat later?
        // Requirement: "自动重复该组中错误的单词（每个错误单词额外重复2次）"
        // Let's move to next, but we already added it to queue.
        if (finalReviewMode) {
          if (wordIndex < finalReviewWords.length - 1) {
            setWordIndex(wordIndex + 1);
          } else {
            // Loop back if there are still mistakes? Let's just finish for now.
            setIsFinished(true);
          }
        } else {
           if (wordIndex < currentGroup.length - 1) {
             setWordIndex(wordIndex + 1);
           } else if (wrongWordsQueue.length > 0) {
             const nextWrong = wrongWordsQueue[0];
             setWrongWordsQueue(prev => prev.slice(1));
             setCurrentGroup(prev => [...prev, nextWrong]);
             setWordIndex(wordIndex + 1);
           } else {
             handleNextGroup();
           }
        }
      }, 2000);
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
          <CheckSquare size={48} />
        </div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">太棒啦！</h2>
        <p className="text-neutral-600 mb-8">你已完成今日50个单词的记忆任务！</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors"
        >
          再练一组
        </button>
      </div>
    );
  }

  if (!currentWord) return null;

  const isZhToEn = practiceMode === 'zh-to-en';
  const displayPrompt = isZhToEn ? currentWord.translation.join(' / ') : currentWord.word;

  return (
    <div className="flex flex-col h-full p-4 max-w-md mx-auto">
      <header className="flex justify-between items-center mb-8 pt-4">
        <div>
          <h1 className="text-xl font-bold text-neutral-800">每日练习</h1>
          <p className="text-xs text-neutral-500 mt-1">
            {finalReviewMode ? '错题集中巩固' : `第 ${groupIndex + 1}/10 组 (${currentWord.partOfSpeech})`}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-medium text-indigo-600">
            {finalReviewMode ? `${wordIndex + 1}/${finalReviewWords.length}` : `${groupIndex * 5 + Math.min(wordIndex + 1, 5)}/50`}
          </div>
          <div className="text-[10px] text-neutral-400">今日进度</div>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center">
        {consecutiveCorrect >= 5 && (
          <div className="absolute top-24 bg-amber-100 text-amber-700 px-4 py-1 rounded-full text-xs font-bold flex items-center shadow-sm animate-bounce">
            🏅 连对5题！单词小能手
          </div>
        )}

        <div className="w-full bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 flex flex-col items-center text-center relative overflow-hidden">
          <div className="text-sm text-neutral-400 font-medium mb-4 uppercase tracking-wider">
            {isZhToEn ? '写出英文' : '写出中文'}
          </div>
          
          <h2 className="text-4xl font-bold text-neutral-900 mb-6 tracking-tight">
            {displayPrompt}
          </h2>

          {!isZhToEn && (
            <button className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-colors mb-6">
              <Play size={18} fill="currentColor" />
            </button>
          )}

          <div className="w-full relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
              placeholder={isZhToEn ? "输入英文单词" : "输入中文释义"}
              className="w-full px-6 py-4 bg-neutral-50 border-2 border-neutral-200 rounded-2xl text-center text-lg font-medium focus:border-indigo-500 focus:ring-0 outline-none transition-all"
              autoFocus
              disabled={feedback.type !== null}
            />
          </div>

          {feedback.type && (
            <div className={`mt-6 p-4 rounded-xl w-full text-sm font-medium animate-in fade-in slide-in-from-bottom-2 ${
              feedback.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {feedback.message}
            </div>
          )}
        </div>

        <button
          onClick={checkAnswer}
          disabled={!inputValue.trim() || feedback.type !== null}
          className="w-full mt-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          提交
        </button>
      </div>
    </div>
  );
}
