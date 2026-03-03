import { useStore } from '../store/useStore';
import { Volume2, Settings as SettingsIcon, Bell, RefreshCw, LogIn } from 'lucide-react';

export default function Settings() {
  const { practiceMode, setPracticeMode, voiceVolume, setVoiceVolume, praiseVolume, setPraiseVolume, dailyProgress } = useStore();

  const handleMockLogin = () => {
    alert('模拟微信登录成功！数据已同步。');
  };

  const today = new Date().toISOString().split('T')[0];
  const todayProgress = dailyProgress[today] || { completedWords: 0, wrongWords: 0, totalAttempted: 0 };
  const accuracy = todayProgress.totalAttempted > 0 
    ? Math.round((todayProgress.completedWords / todayProgress.totalAttempted) * 100) 
    : 0;

  return (
    <div className="flex flex-col h-full bg-neutral-50 pb-20 p-4">
      <header className="pt-6 pb-4">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2 tracking-tight">设置与进度</h1>
      </header>

      <div className="space-y-6">
        {/* Progress Card */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-800">今日进度</h2>
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              {today}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-neutral-50 rounded-2xl p-4">
              <div className="text-2xl font-black text-indigo-600 mb-1">{todayProgress.completedWords}</div>
              <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">已完成</div>
            </div>
            <div className="bg-neutral-50 rounded-2xl p-4">
              <div className="text-2xl font-black text-rose-500 mb-1">{todayProgress.wrongWords}</div>
              <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">错误数</div>
            </div>
            <div className="bg-neutral-50 rounded-2xl p-4">
              <div className="text-2xl font-black text-emerald-500 mb-1">{accuracy}%</div>
              <div className="text-[10px] font-medium text-neutral-500 uppercase tracking-wider">正确率</div>
            </div>
          </div>
        </section>

        {/* Settings List */}
        <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <SettingsIcon size={20} />
              </div>
              <span className="font-bold text-neutral-800">练习模式</span>
            </div>
            <select 
              value={practiceMode}
              onChange={(e) => setPracticeMode(e.target.value as any)}
              className="bg-neutral-50 border-none text-sm font-medium text-neutral-700 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="zh-to-en">显示中文写英文</option>
              <option value="en-to-zh">显示英文写中文</option>
            </select>
          </div>

          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Volume2 size={20} />
              </div>
              <span className="font-bold text-neutral-800">发音音量</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.1" 
              value={voiceVolume}
              onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
              className="w-32 accent-emerald-500"
            />
          </div>

          <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                <Bell size={20} />
              </div>
              <span className="font-bold text-neutral-800">语音夸奖音量</span>
            </div>
            <input 
              type="range" 
              min="0" max="1" step="0.1" 
              value={praiseVolume}
              onChange={(e) => setPraiseVolume(parseFloat(e.target.value))}
              className="w-32 accent-amber-500"
            />
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <RefreshCw size={20} />
              </div>
              <span className="font-bold text-neutral-800">每日提醒</span>
            </div>
            <button className="px-4 py-2 bg-neutral-100 text-neutral-600 rounded-xl text-sm font-bold hover:bg-neutral-200 transition-colors">
              设置时间
            </button>
          </div>
        </section>

        {/* Account */}
        <section className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-4">
          <button 
            onClick={handleMockLogin}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#07c160] text-white rounded-xl font-bold text-lg hover:bg-[#06ad56] transition-colors"
          >
            <LogIn size={20} />
            微信一键登录同步数据
          </button>
          <p className="text-center text-xs text-neutral-400 mt-3">
            登录后可同步学习进度、错题本和收藏词汇
          </p>
        </section>
      </div>
    </div>
  );
}
