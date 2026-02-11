
import React, { useState } from 'react';
import { ChevronRight, Info, Crown, Diamond, Sparkles, Shield, Star, History, Gift as GiftIcon, ChevronLeft, Lock, X } from 'lucide-react';
import { User, AppRoute } from '../types';
import LevelBadge from '../components/LevelBadge';

interface SupporterLevelProps {
  user: User;
  onBack: () => void;
  onNavigate: (route: AppRoute) => void;
}

const SupporterLevel: React.FC<SupporterLevelProps> = ({ user, onBack, onNavigate }) => {
  const currentLevel = user.supporterLevel || 1;

  const nobles = [
    { level: 1, label: 'Noble 1-3', icon: '🐎', color: 'from-zinc-400 to-zinc-600', text: 'N1' },
    { level: 4, label: 'Noble 4-6', icon: '🐺', color: 'from-green-400 to-green-600', text: 'N4' },
    { level: 7, label: 'Noble 7-9', icon: '🐆', color: 'from-cyan-400 to-cyan-600', text: 'N7' },
    { level: 10, label: 'Noble 10-12', icon: '🐯', color: 'from-blue-500 to-blue-700', text: 'N10' },
    { level: 13, label: 'Noble 13-15', icon: '👾', color: 'from-purple-500 to-purple-700', text: 'N13' },
    { level: 16, label: 'Noble 16-18', icon: '🦁', color: 'from-orange-500 to-red-600', text: 'N16' },
    { level: 19, label: 'Noble 19', icon: '🐉', color: 'from-red-600 to-red-800', text: 'N19' },
    { level: 20, label: 'Noble 20', icon: '🐲', color: 'from-yellow-400 to-amber-600', text: 'N20' },
  ];

  return (
    <div className="h-screen bg-black text-white font-sans flex flex-col overflow-hidden relative" dir="rtl">
      {/* Starry Background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
      <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-yellow-500/10 to-transparent"></div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between relative z-50 bg-transparent">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full"><X size={24} /></button>
        <div className="flex items-center gap-1">
          <h2 className="text-lg font-black tracking-tight text-zinc-300">الأرستقراطية</h2>
          <ChevronLeft size={18} className="text-zinc-500" />
        </div>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-12 z-10">
        {/* Tier Tabs (Mockup) */}
        <div className="flex justify-between px-2 text-zinc-500 font-black text-sm border-b border-white/5 pb-2">
          {['Noble 1', 'Noble 2', 'Noble 3', 'Noble 4', 'Noble 5'].reverse().map((tab, i) => (
            <button key={i} className={`${i === 0 ? 'text-white border-b-2 border-white' : ''} px-1 pb-1`}>{tab}</button>
          ))}
        </div>

        {/* Nobles Grid */}
        <div className="grid grid-cols-3 gap-y-10 gap-x-4 px-2 py-4">
          {nobles.map((noble, i) => (
            <div key={i} className="flex flex-col items-center gap-2 group">
              <div className={`relative w-16 h-8 rounded-full bg-gradient-to-r ${noble.color} border border-white/20 flex items-center px-1 shadow-lg`}>
                <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center text-[10px]">
                  {noble.icon}
                </div>
                <span className="flex-1 text-center font-black italic text-[11px]">{noble.text}</span>
              </div>
              <span className="text-[10px] font-bold text-zinc-500">{noble.label}</span>
            </div>
          ))}
        </div>

        {/* Status Section */}
        <div className="text-center space-y-8 pt-10">
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-amber-200">شارة الحالة</h3>
            <p className="text-sm text-zinc-500 font-bold leading-relaxed px-10">
              يُعرض في صفحتك الشخصية، الملف المصغر، رسائل دردشة الغرفة، قائمة الأصدقاء، والتصنيفات وغيرها.
            </p>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 overflow-x-hidden w-full px-4">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className={`w-1.5 h-1.5 rounded-full shrink-0 ${i === 24 ? 'bg-white' : 'bg-white/20'}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-6 pb-12 bg-gradient-to-t from-black via-black/90 to-transparent fixed bottom-0 left-0 right-0 z-[100]">
        <button 
          onClick={() => onNavigate(AppRoute.STORE)}
          className="w-full bg-gradient-to-b from-amber-200 to-amber-500 text-black py-4.5 rounded-full font-black text-xl shadow-[0_0_30px_rgba(245,158,11,0.3)] active:scale-95 transition-all"
        >
          إعادة الشحن
        </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default SupporterLevel;
