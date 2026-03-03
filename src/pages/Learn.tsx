import { useState, useMemo } from 'react';
import { WORDS, Grade, PartOfSpeech } from '../data/words';
import { useStore } from '../store/useStore';
import { Search, Volume2, Star, StarOff, Filter } from 'lucide-react';

export default function Learn() {
  const { favorites, toggleFavorite, addMistake } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<Grade | '全部'>('全部');
  const [selectedPos, setSelectedPos] = useState<PartOfSpeech | '全部'>('全部');
  const [activeWordId, setActiveWordId] = useState<string | null>(null);

  const filteredWords = useMemo(() => {
    return WORDS.filter(w => {
      const matchSearch = w.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          w.translation.some(t => t.includes(searchTerm));
      const matchGrade = selectedGrade === '全部' || w.grade === selectedGrade;
      const matchPos = selectedPos === '全部' || w.partOfSpeech === selectedPos;
      return matchSearch && matchGrade && matchPos;
    });
  }, [searchTerm, selectedGrade, selectedPos]);

  const playAudio = (word: string) => {
    // In a real app, use Web Speech API or audio files
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const handleShadowing = (wordId: string) => {
    // Mock shadowing logic
    alert('请跟读单词...');
    // Simulate a wrong attempt occasionally
    if (Math.random() > 0.7) {
      alert('发音不够准确，已加入错题本！');
      addMistake(wordId);
    } else {
      alert('发音很棒！');
    }
  };

  return (
    <div className="flex flex-col h-full bg-neutral-50 pb-20">
      <div className="sticky top-0 bg-white z-10 px-4 pt-6 pb-4 shadow-sm border-b border-neutral-100">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4 tracking-tight">词汇学习</h1>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
          <input
            type="text"
            placeholder="搜索英文或中文..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-100 border-transparent rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="flex items-center gap-1 text-xs font-medium text-neutral-500 mr-2 shrink-0">
            <Filter size={14} /> 筛选
          </div>
          {['全部', '初一', '初二', '初三'].map(grade => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade as Grade | '全部')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedGrade === grade ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {grade}
            </button>
          ))}
          <div className="w-px h-4 bg-neutral-300 mx-1 shrink-0 self-center" />
          {['全部', 'n.', 'v.', 'adj.', 'adv.'].map(pos => (
            <button
              key={pos}
              onClick={() => setSelectedPos(pos as PartOfSpeech | '全部')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedPos === pos ? 'bg-indigo-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredWords.length === 0 ? (
          <div className="text-center text-neutral-500 mt-10 text-sm">
            没有找到匹配的单词
          </div>
        ) : (
          filteredWords.map(word => (
            <div 
              key={word.id} 
              className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden ${
                activeWordId === word.id ? 'border-indigo-200 shadow-md' : 'border-neutral-100 shadow-sm'
              }`}
            >
              <div 
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setActiveWordId(activeWordId === word.id ? null : word.id)}
              >
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-neutral-900">{word.word}</span>
                    <span className="text-xs text-neutral-500 font-mono">{word.phonetic}</span>
                  </div>
                  <div className="text-sm text-neutral-600 mt-1">
                    <span className="text-indigo-600 font-medium mr-1">{word.partOfSpeech}</span>
                    {word.translation.join(' / ')}
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(word.id); }}
                  className="p-2 text-neutral-400 hover:text-amber-500 transition-colors"
                >
                  {favorites.includes(word.id) ? <Star fill="currentColor" className="text-amber-500" size={20} /> : <StarOff size={20} />}
                </button>
              </div>

              {activeWordId === word.id && (
                <div className="px-4 pb-4 pt-2 border-t border-neutral-50 bg-neutral-50/50 text-sm">
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">例句</span>
                      {word.examples.map((ex, i) => (
                        <p key={i} className="text-neutral-700 italic">"{ex}"</p>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">同义词</span>
                        <p className="text-neutral-600">{word.synonyms.length > 0 ? word.synonyms.join(', ') : '无'}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block mb-1">反义词</span>
                        <p className="text-neutral-600">{word.antonyms.length > 0 ? word.antonyms.join(', ') : '无'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); playAudio(word.word); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
                      >
                        <Volume2 size={16} /> 发音
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleShadowing(word.id); }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-medium hover:bg-emerald-100 transition-colors"
                      >
                        跟读
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
