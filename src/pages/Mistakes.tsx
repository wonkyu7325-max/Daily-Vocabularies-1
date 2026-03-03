import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { WORDS, Word, PartOfSpeech } from '../data/words';
import { BookMarked, Play, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playCorrectSound } from '../utils/audio';

export default function Mistakes() {
  const { mistakes, practiceMode, recordMistakeCorrect, removeMistake } = useStore();
  const [selectedPos, setSelectedPos] = useState<PartOfSpeech | '全部'>('全部');
  const [practicingWord, setPracticingWord] = useState<Word | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const mistakeList = useMemo(() => {
    return Object.values(mistakes)
      .sort((a, b) => b.lastWrongTime - a.lastWrongTime)
      .map(m => ({
        ...WORDS.find(w => w.id === m.wordId)!,
        mistakeRecord: m
      }))
      .filter(w => w && (selectedPos === '全部' || w.partOfSpeech === selectedPos));
  }, [mistakes, selectedPos]);

  const checkAnswer = () => {
    if (!practicingWord || !inputValue.trim()) return;

    const isZhToEn = practiceMode === 'zh-to-en';
    let isCorrect = false;

    if (isZhToEn) {
      isCorrect = inputValue.trim() === practicingWord.word;
    } else {
      const validAnswers = [...practicingWord.translation, ...practicingWord.synonyms];
      isCorrect = validAnswers.some(ans => inputValue.trim().includes(ans) || ans.includes(inputValue.trim()));
    }

    if (isCorrect) {
      playCorrectSound();
      setFeedback({ type: 'success', message: '正确！继续加油💪' });
      recordMistakeCorrect(practicingWord.id);
      
      const record = mistakes[practicingWord.id];
      if (record && record.consecutiveCorrect + 1 >= 3) {
        // Mastered!
        setTimeout(() => {
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          alert(`恭喜！成功掌握这个单词啦🥳：${practicingWord.word}`);
          
          const state = useStore.getState();
          if (state.praiseVolume > 0) {
            const utterance = new SpeechSynthesisUtterance("太厉害啦！这个单词已经完全掌握，继续攻克下一个吧");
            utterance.lang = 'zh-CN';
            utterance.volume = state.praiseVolume;
            window.speechSynthesis.speak(utterance);
          }

          setPracticingWord(null);
          setInputValue('');
          setFeedback({ type: null, message: '' });
        }, 500);
        return;
      }

      setTimeout(() => {
        setFeedback({ type: null, message: '' });
        setInputValue('');
        setPracticingWord(null); // Return to list after correct
      }, 1000);

    } else {
      setFeedback({ 
        type: 'error', 
        message: `再试一次～ 正确答案：${isZhToEn ? practicingWord.word : practicingWord.translation.join(' / ')} (${practicingWord.partOfSpeech})` 
      });
      // Reset consecutive correct by adding mistake again
      useStore.getState().addMistake(practicingWord.id);

      setTimeout(() => {
        setFeedback({ type: null, message: '' });
        setInputValue('');
      }, 2000);
    }
  };

  if (practicingWord) {
    const isZhToEn = practiceMode === 'zh-to-en';
    const displayPrompt = isZhToEn ? practicingWord.translation.join(' / ') : practicingWord.word;

    return (
      <div className="flex flex-col h-full p-4 max-w-md mx-auto bg-neutral-50">
        <header className="flex justify-between items-center mb-8 pt-4">
          <button 
            onClick={() => setPracticingWord(null)}
            className="text-neutral-500 hover:text-neutral-900 font-medium text-sm transition-colors"
          >
            ← 返回错题本
          </button>
          <div className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            连续答对 {mistakes[practicingWord.id]?.consecutiveCorrect || 0}/3 次可移除
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center">
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

  return (
    <div className="flex flex-col h-full bg-neutral-50 pb-20">
      <div className="sticky top-0 bg-white z-10 px-4 pt-6 pb-4 shadow-sm border-b border-neutral-100">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">错题巩固</h1>
        <p className="text-sm text-neutral-500 mb-4">
          今日有 <span className="font-bold text-rose-500">{mistakeList.length}</span> 道错题待练习。连续答对3次即可掌握！
        </p>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['全部', 'n.', 'v.', 'adj.', 'adv.'].map(pos => (
            <button
              key={pos}
              onClick={() => setSelectedPos(pos as PartOfSpeech | '全部')}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedPos === pos ? 'bg-indigo-600 text-white shadow-sm' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mistakeList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <BookMarked size={32} />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-1">太棒啦！</h3>
            <p className="text-neutral-500 text-sm">错题本空空如也，继续保持哦～</p>
          </div>
        ) : (
          mistakeList.map(word => (
            <div 
              key={word.id} 
              className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-lg font-bold text-neutral-900">{word.word}</span>
                  <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                    错误 {word.mistakeRecord.wrongCount} 次
                  </span>
                </div>
                <div className="text-sm text-neutral-600">
                  <span className="text-indigo-600 font-medium mr-1">{word.partOfSpeech}</span>
                  {word.translation.join(' / ')}
                </div>
                <div className="text-xs text-neutral-400 mt-2 flex items-center gap-2">
                  <span>进度: {word.mistakeRecord.consecutiveCorrect}/3</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full ${i < word.mistakeRecord.consecutiveCorrect ? 'bg-emerald-500' : 'bg-neutral-200'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 ml-4">
                <button 
                  onClick={() => setPracticingWord(word)}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors"
                >
                  练习
                </button>
                <button 
                  onClick={() => removeMistake(word.id)}
                  className="p-2 text-neutral-400 hover:text-rose-500 transition-colors flex justify-center"
                  title="移除错题"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
