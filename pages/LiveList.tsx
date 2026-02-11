
import React, { useState, useRef } from 'react';
import { Search, Plus, Users, Radio, TrendingUp, X, Image as ImageIcon, Camera, Sparkles, Video } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { Room } from '../types';

interface LiveListProps {
  rooms: Room[];
  onRoomSelect: (id: string, customData?: any) => void;
  onProfileClick?: (userId: string) => void;
}

const LiveList: React.FC<LiveListProps> = ({ rooms, onRoomSelect, onProfileClick }) => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomBg, setNewRoomBg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const currentUser = JSON.parse(localStorage.getItem('tikbook_user') || JSON.stringify(MOCK_USER));
  const categories = ['الكل', 'موسيقى', 'دردشة', 'ألعاب', 'ثقافة', 'تحديات'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setNewRoomBg(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleStartLive = () => {
    if (!newRoomTitle.trim()) {
      alert("يرجى كتابة عنوان للغرفة");
      return;
    }
    const customRoom = {
      id: `custom-${Date.now()}`,
      title: newRoomTitle,
      coverImage: newRoomBg || 'https://picsum.photos/800/1200?u=live',
      hostId: currentUser.id,
      hostName: currentUser.name,
      viewers: 1
    };
    onRoomSelect(customRoom.id, customRoom);
  };

  return (
    <div className="h-full bg-[#050505] text-white p-4 pb-32 font-sans relative overflow-y-auto no-scrollbar" dir="rtl">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Modern Header with Integrated Buttons */}
      <div className="flex justify-between items-center mb-8 pt-6 relative z-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            بث مباشر <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">اكتشف أجمل اللحظات الآن</p>
        </div>
        
        {/* Buttons Group: Search & Create */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="p-3 bg-gradient-to-tr from-yellow-600 to-yellow-400 text-black rounded-2xl shadow-lg shadow-yellow-500/10 active:scale-90 transition-all border border-white/20"
            title="ابدأ بثك الخاص"
          >
            <Video size={20} strokeWidth={2.5} />
          </button>
          <button className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 active:scale-90 transition-all">
            <Search size={22} className="text-zinc-300" />
          </button>
        </div>
      </div>

      {/* Trending Section */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-2 mb-4 px-1">
          <TrendingUp size={16} className="text-yellow-500" />
          <h3 className="text-xs font-black uppercase text-zinc-400 tracking-tighter">الغرف الرائجة</h3>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {rooms.slice(0, 3).map((room) => (
            <div key={room.id} onClick={() => onRoomSelect(room.id)} className="min-w-[140px] flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500 to-orange-500 rounded-[28px] animate-pulse blur-md opacity-30"></div>
                <img src={room.coverImage} className="w-full h-full object-cover rounded-[28px] border-2 border-white/10 relative z-10" />
              </div>
              <span className="text-[10px] font-black truncate w-full text-center">{room.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Glassy Categories */}
      <div className="flex gap-2.5 overflow-x-auto no-scrollbar mb-8 relative z-10">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-2xl text-[11px] font-black transition-all border whitespace-nowrap ${
              activeCategory === cat 
              ? 'bg-yellow-500 text-black border-yellow-500 shadow-lg shadow-yellow-500/20' 
              : 'bg-white/5 text-zinc-400 border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid Rooms */}
      <div className="grid grid-cols-2 gap-5 relative z-10">
        {rooms.map((room) => (
          <div key={room.id} onClick={() => onRoomSelect(room.id)} className="group relative aspect-[3/4] rounded-[40px] overflow-hidden bg-zinc-900 border border-white/10 shadow-2xl active:scale-95 transition-all">
            <img src={room.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent p-4 flex flex-col justify-end">
               <h4 className="text-[12px] font-black line-clamp-2">{room.title}</h4>
               <div className="flex items-center gap-1.5 mt-2">
                  <img src={`https://picsum.photos/40/40?u=${room.hostId}`} className="w-5 h-5 rounded-full border border-yellow-500/50" />
                  <span className="text-[9px] font-bold opacity-70">@{room.hostId}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Real Room Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="w-full max-w-sm bg-zinc-900 rounded-[40px] border border-white/10 p-8 relative animate-slide-up shadow-2xl">
              <button onClick={() => setShowCreateModal(false)} className="absolute top-6 left-6 text-zinc-500 p-2"><X size={24} /></button>
              
              <div className="text-center mb-8">
                 <h2 className="text-xl font-black">إعداد غرفتك المباشرة</h2>
                 <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase tracking-widest">كن ملك المجلس القادم</p>
              </div>

              <div className="space-y-6">
                 {/* Background Picker */}
                 <div 
                   onClick={() => fileInputRef.current?.click()}
                   className="aspect-video w-full rounded-3xl border-2 border-dashed border-white/10 bg-black/40 flex flex-col items-center justify-center overflow-hidden cursor-pointer group relative"
                 >
                   {newRoomBg ? (
                     <img src={newRoomBg} className="w-full h-full object-cover" />
                   ) : (
                     <>
                        <ImageIcon size={32} className="text-zinc-700 group-hover:text-yellow-500 transition-colors" />
                        <span className="text-[10px] font-bold text-zinc-600 mt-2">اختر خلفية للغرفة</span>
                     </>
                   )}
                   <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                 </div>

                 {/* Title Input */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 px-2 block">عنوان الغرفة</label>
                    <input 
                      type="text" 
                      value={newRoomTitle}
                      onChange={(e) => setNewRoomTitle(e.target.value)}
                      placeholder="مثال: سهرة طربية مع الأصدقاء..."
                      className="w-full bg-black/60 border border-white/5 rounded-2xl py-4 px-5 text-sm font-bold focus:outline-none focus:border-yellow-500/50 transition-all text-white"
                    />
                 </div>

                 {/* Host Display */}
                 <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-yellow-500/50" />
                    <div>
                       <span className="text-[10px] text-zinc-500 font-bold block">المستضيف</span>
                       <span className="text-sm font-black">{currentUser.name}</span>
                    </div>
                 </div>

                 <button 
                   onClick={handleStartLive}
                   className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black text-md shadow-xl shadow-yellow-500/20 active:scale-95 transition-all"
                 >
                   بدء البث الآن
                 </button>
              </div>
           </div>
        </div>
      )}
      <style>{`
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default LiveList;
