
import React from 'react';
import { ChevronRight, UserPlus, Check, Search, User } from 'lucide-react';

const Followers: React.FC<{ onBack: () => void; onProfileClick?: (id: string) => void }> = ({ onBack, onProfileClick }) => {
  const followerRequests = [
    { id: 'req1', name: 'سارة خالد', username: 'sara_kh', avatar: 'https://picsum.photos/100/100?u=sara', time: 'منذ 2س' },
    { id: 'req2', name: 'محمد العمودي', username: 'mo_amoudi', avatar: 'https://picsum.photos/100/100?u=mo', time: 'منذ 5س' },
    { id: 'req3', name: 'ريما القحطاني', username: 'reema_q', avatar: 'https://picsum.photos/100/100?u=reema', time: 'أمس' },
    { id: 'req4', name: 'يوسف بن علي', username: 'yousef_ali', avatar: 'https://picsum.photos/100/100?u=yousef', time: 'قبل يومين' },
  ];

  return (
    <div className="h-screen bg-white text-black font-sans flex flex-col" dir="rtl">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-zinc-50 sticky top-0 bg-white z-50 shrink-0">
        <button onClick={onBack} className="p-1 active:scale-90 transition-transform">
          <ChevronRight size={28} className="text-zinc-900" />
        </button>
        <h2 className="text-[17px] font-bold">متابعون جدد</h2>
        <button className="p-1"><Search size={22} className="text-zinc-400" /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {followerRequests.length > 0 ? (
          <div className="divide-y divide-zinc-50">
            {followerRequests.map((req) => (
              <div key={req.id} className="flex items-center gap-4 px-4 py-4 active:bg-zinc-50 transition-colors">
                <div 
                  onClick={() => onProfileClick?.(req.id)}
                  className="w-14 h-14 rounded-full border border-zinc-100 overflow-hidden cursor-pointer shrink-0"
                >
                  <img src={req.avatar} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0" onClick={() => onProfileClick?.(req.id)}>
                   <h4 className="text-[14px] font-bold text-zinc-900 truncate">{req.name}</h4>
                   <p className="text-[12px] text-zinc-400 truncate">@{req.username}</p>
                   <p className="text-[10px] text-zinc-300 mt-0.5">{req.time}</p>
                </div>
                <button className="bg-[#ff2d55] text-white px-5 py-2 rounded-xl text-[11px] font-black shadow-sm active:scale-95 transition-all">
                  رد المتابعة
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center">
            <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
              <User size={32} className="text-zinc-200" />
            </div>
            <p className="text-sm font-bold text-zinc-400">لا توجد طلبات متابعة جديدة حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Followers;
