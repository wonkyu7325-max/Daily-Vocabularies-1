import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { BookOpen, CheckSquare, Settings, BookMarked, X } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Layout() {
  const { addLearningTime, praiseVolume } = useStore();
  const [showPraise, setShowPraise] = useState(false);

  useEffect(() => {
    // Track learning time every minute
    const interval = setInterval(() => {
      addLearningTime(1);
      
      const state = useStore.getState();
      // If total learning minutes is a multiple of 30, show praise
      if (state.totalLearningMinutes > 0 && state.totalLearningMinutes % 30 === 0) {
        setShowPraise(true);
        if (praiseVolume > 0) {
          const utterance = new SpeechSynthesisUtterance("太棒啦！已经连续学习30分钟，休息5分钟再继续吧～");
          utterance.lang = 'zh-CN';
          utterance.volume = praiseVolume;
          window.speechSynthesis.speak(utterance);
        }
      }
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, [addLearningTime, praiseVolume]);

  return (
    <div className="flex flex-col h-screen bg-neutral-50 text-neutral-900 font-sans relative">
      {showPraise && (
        <div className="absolute top-4 left-4 right-4 bg-amber-100 border border-amber-200 text-amber-800 p-4 rounded-2xl shadow-lg z-50 flex items-start justify-between animate-in slide-in-from-top-4">
          <div>
            <h3 className="font-bold text-lg mb-1">🎉 太自律啦！</h3>
            <p className="text-sm">连续学习30分钟，继续加油，你一定可以掌握更多单词✨</p>
          </div>
          <button onClick={() => setShowPraise(false)} className="p-1 hover:bg-amber-200 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto pb-16">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 w-full bg-white border-t border-neutral-200 flex justify-around items-center h-16 px-2 shadow-sm z-40">
        <NavItem to="/" icon={<CheckSquare size={24} />} label="每日练习" />
        <NavItem to="/learn" icon={<BookOpen size={24} />} label="词汇学习" />
        <NavItem to="/mistakes" icon={<BookMarked size={24} />} label="错题巩固" />
        <NavItem to="/settings" icon={<Settings size={24} />} label="设置" />
      </nav>
    </div>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
          isActive ? 'text-indigo-600' : 'text-neutral-500 hover:text-neutral-700'
        }`
      }
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </NavLink>
  );
}
