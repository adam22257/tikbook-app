
import React, { useState } from 'react';
import { ChevronRight, Copy, Check, UserPlus, Gift, Sparkles, Trophy, Users, Share2 } from 'lucide-react';
import { User } from '../types';

interface ReferralProps {
  onBack: () => void;
  user: User;
}

const Referral: React.FC<ReferralProps> = ({ onBack, user }) => {
  const [copied, setCopied] = useState(false);
  const referralCode = user.referralCode || `TB-${user.id.substring(0, 5).toUpperCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden" dir="rtl">
      {/* Background Glow */}
      <div className="absolute top-[-20%] right-[-10%] w-full h-[60%] bg-gradient-to-b from-cyan-500/10 to-transparent blur-[120px] pointer-events-none"></div>

      {/* Header */}
      <div className="p-4 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full active:scale-90 transition-transform">
          <ChevronRight size={24} />
        </button>
        <h2 className="text-lg font-black bg-gradient-to-l from-yellow-500 to-white bg-clip-text text-transparent">إحالة الأصدقاء</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
        {/* Luxury Hero Card */}
        <div className="relative bg-gradient-to-br from-zinc-900 to-black rounded-[40px] p-8 border border-white/10 shadow-2xl overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
           
           <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-3xl flex items-center justify-center shadow-xl shadow-yellow-500/20 mb-6 group-hover:scale-110 transition-transform">
                 <Gift size={40} className="text-black" />
              </div>
              <h1 className="text-2xl font-black mb-2">اكسب عملات مجانية!</h1>
              <p className="text-sm text-zinc-400 font-bold leading-relaxed max-w-[250px]">
                ادعُ أصدقاءك للانضمام إلى تيك بوك واحصل على <span className="text-yellow-500">10 عملات</span> ذهبية فور تسجيلهم.
              </p>
           </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-zinc-900/50 p-6 rounded-[32px] border border-white/5 flex flex-col items-center gap-2">
              <Users size={24} className="text-cyan-400" />
              <span className="text-2xl font-black">0</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">إحالات ناجحة</span>
           </div>
           <div className="bg-zinc-900/50 p-6 rounded-[32px] border border-white/5 flex flex-col items-center gap-2">
              <Trophy size={24} className="text-yellow-500" />
              <span className="text-2xl font-black">0</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">إجمالي الربح</span>
           </div>
        </div>

        {/* Referral Code Box */}
        <div className="space-y-4">
           <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] px-2 block">كود الإحالة الخاص بك</label>
           <div className="bg-white/5 border border-white/10 p-5 rounded-[32px] flex items-center justify-between group">
              <span className="text-2xl font-black tracking-widest text-yellow-500 select-all">{referralCode}</span>
              <button 
                onClick={handleCopy}
                className={`p-4 rounded-2xl transition-all active:scale-90 ${copied ? 'bg-green-500 text-white' : 'bg-white/5 text-zinc-400 group-hover:bg-yellow-500 group-hover:text-black'}`}
              >
                {copied ? <Check size={24} /> : <Copy size={24} />}
              </button>
           </div>
        </div>

        {/* How it works */}
        <div className="bg-zinc-900/30 p-8 rounded-[40px] border border-white/5 space-y-6">
           <h3 className="text-sm font-black flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-500" /> كيف تعمل الإحالة؟
           </h3>
           <div className="space-y-6 relative">
              <div className="absolute top-0 right-[15px] bottom-0 w-0.5 bg-white/5"></div>
              
              <div className="flex gap-6 relative">
                 <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-black shrink-0 z-10 border border-white/10">1</div>
                 <p className="text-xs text-zinc-400 font-bold leading-relaxed">انسخ كود الإحالة الخاص بك وشاركه مع أصدقائك عبر أي منصة تواصل.</p>
              </div>
              
              <div className="flex gap-6 relative">
                 <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-black shrink-0 z-10 border border-white/10">2</div>
                 <p className="text-xs text-zinc-400 font-bold leading-relaxed">عندما يسجل صديقك حساباً جديداً ويقوم بإدخال كود الإحالة الخاص بك.</p>
              </div>

              <div className="flex gap-6 relative">
                 <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-black shrink-0 z-10 text-black shadow-lg shadow-yellow-500/20">3</div>
                 <p className="text-xs text-yellow-500 font-black leading-relaxed">ستحصل فوراً على 10 عملات في محفظتك وسيتم إشعارك بذلك!</p>
              </div>
           </div>
        </div>
      </div>

      {/* Share Button Overlay */}
      <div className="p-6 pb-12 bg-gradient-to-t from-black via-black/80 to-transparent fixed bottom-0 left-0 right-0 z-[60]">
        <button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-black py-4 rounded-2xl font-black text-lg shadow-2xl shadow-yellow-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
          <Share2 size={22} strokeWidth={2.5} /> شارك كود الإحالة الآن
        </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Referral;
