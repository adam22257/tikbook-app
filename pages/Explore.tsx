
import React from 'react';
import { Search, TrendingUp, Music, Film, UserPlus } from 'lucide-react';
import { MOCK_POSTS } from '../constants';

const Explore: React.FC<{ onProfileClick?: (userId: string) => void }> = ({ onProfileClick }) => {
  const categories = [
    { name: 'رائج', icon: <TrendingUp size={16} /> },
    { name: 'موسيقى', icon: <Music size={16} /> },
    { name: 'سينما', icon: <Film size={16} /> },
    { name: 'ألعاب', icon: <UserPlus size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24" dir="rtl">
      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input 
          type="text" 
          placeholder="ابحث عن محتوى، أصدقاء، هاشتاج..." 
          className="w-full bg-zinc-900 border-none rounded-2xl py-3 px-12 text-sm focus:ring-1 focus:ring-yellow-500"
        />
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8">
        {categories.map((cat, i) => (
          <button key={i} className="flex items-center gap-2 bg-zinc-900 px-4 py-2 rounded-full text-xs font-bold border border-white/5 whitespace-nowrap active:scale-95 transition-transform">
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Trending Hashtags */}
      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          # هاشتاجات رائجة
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {['دبي_تجمعنا', 'فن_الطبخ', 'تقنية_المستقبل', 'موسيقى_عربية'].map((tag, i) => (
            <div key={i} className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5">
              <p className="font-bold text-sm">#{tag}</p>
              <p className="text-[10px] text-zinc-500 mt-1">1.2M مشاهدة</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Content */}
      <h3 className="text-lg font-bold mb-4">اكتشف المزيد</h3>
      <div className="grid grid-cols-2 gap-2">
        {MOCK_POSTS.map((post, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden relative group">
            <img src={`https://picsum.photos/400/600?random=${i+100}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
              <span 
                onClick={() => onProfileClick?.(`user_${i}`)}
                className="text-[10px] font-bold cursor-pointer hover:text-yellow-500 transition-colors pointer-events-auto"
              >
                @user_{i}
              </span>
            </div>
          </div>
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i+10} className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900">
            <img src={`https://picsum.photos/400/600?random=${i+120}`} className="w-full h-full object-cover opacity-70" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
