
import React, { useState, useEffect, useRef } from 'react';
import { Users, Mic, MicOff, MessageCircle, X, Gift as GiftIcon, Send, Crown, Star, Sparkles, Trophy, Grid, Mail, Power, Lock } from 'lucide-react';
import { MOCK_ROOMS, GIFTS, MOCK_USER } from '../constants';
import { Gift, User } from '../types';
import LevelBadge from '../components/LevelBadge';

const LiveRoom: React.FC<{ roomId: string; customData?: any; onExit: () => void; onProfileClick?: (userId: string) => void }> = ({ roomId, customData, onExit, onProfileClick }) => {
  const [currentRoom] = useState<any>(() => {
    if (customData) return customData;
    const room = MOCK_ROOMS.find(r => r.id === roomId);
    return room || {
      id: roomId || 'r1',
      title: "غرفة بث مباشرة",
      coverImage: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop',
      hostId: 'ID:000000',
      hostName: 'المستضيف',
      viewers: 0
    };
  });

  const [showGifts, setShowGifts] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [showEntrance, setShowEntrance] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [privateMessagesCount, setPrivateMessagesCount] = useState(0);
  
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('tikbook_user');
      return saved ? JSON.parse(saved) : MOCK_USER;
    } catch (e) {
      return MOCK_USER;
    }
  });

  const [roomSeats] = useState<any[]>(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      user: i < 5 ? { 
        id: `u-${i}`, 
        name: i === 2 ? 'rorita' : i === 0 ? 'سِـيِّبًأّنِيِّ' : 'تہيہلأهہ', 
        avatar: `https://picsum.photos/100/100?u=${i + 120}`, 
        supporterLevel: i * 3 + 1,
        nobleLevel: i === 2 ? 20 : (i === 0 ? 16 : 1),
        hasFire: i < 3
      } : null,
      isLocked: i === 3 || i === 7,
      isSpeaking: i === 2
    }));
  });

  useEffect(() => {
    // إظهار إشعار الانضمام الصغير في الأسفل بعد ثانية
    const entryTimer = setTimeout(() => setShowEntrance(true), 1000);
    const hideTimer = setTimeout(() => setShowEntrance(false), 6000);
    
    return () => {
      clearTimeout(entryTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      user: currentUser.name,
      text: inputText,
      level: currentUser.supporterLevel || 1,
      nobleLevel: 1,
      vipLevel: 5,
    }].slice(-20));
    setInputText('');
  };

  const handleGiftSelect = (gift: Gift) => {
    if (currentUser.coins < gift.price) {
      alert('رصيدك غير كافٍ');
      return;
    }
    const updatedUser = { ...currentUser, coins: currentUser.coins - gift.price };
    setCurrentUser(updatedUser);
    localStorage.setItem('tikbook_user', JSON.stringify(updatedUser));
    
    setMessages(prev => [...prev, {
        id: Date.now().toString(),
        user: currentUser.name,
        text: `أرسل هدية: ${gift.icon}`,
        isGift: true
    }]);
    setShowGifts(false);
  };

  return (
    <div className="absolute inset-0 z-[100] bg-zinc-950 text-white flex flex-col font-sans overflow-hidden select-none" dir="rtl">
      {/* Background with Blur */}
      <div className="absolute inset-0 z-0">
        <img src={currentRoom.coverImage} className="w-full h-full object-cover opacity-60 blur-[6px] scale-110" alt="bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-zinc-950/90"></div>
      </div>

      {/* Header - Compact Luxury */}
      <div className="relative z-20 p-4 pt-10 flex flex-col gap-2 shrink-0">
        <div className="flex justify-between items-start">
           <div className="flex gap-2">
              <button onClick={onExit} className="p-2.5 bg-black/50 rounded-full backdrop-blur-2xl border border-white/10 active:scale-90 transition-transform">
                <Power size={18} className="text-white" />
              </button>
              <div className="bg-black/50 backdrop-blur-2xl px-3 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                 <Users size={12} className="text-zinc-300" />
                 <span className="text-[10px] font-black">{currentRoom.viewers || 9}</span>
              </div>
           </div>
           
           <div className="bg-black/60 backdrop-blur-3xl px-3 py-1.5 rounded-2xl flex items-center gap-3 border border-white/10 shadow-2xl">
              <div className="text-left">
                 <h3 className="text-[12px] font-black leading-none text-white truncate max-w-[80px]">{currentRoom.hostName}</h3>
                 <span className="text-[8px] text-zinc-400 font-bold block mt-1">ID:{currentRoom.hostId}</span>
              </div>
              <img src={currentRoom.coverImage} className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-inner" alt="host" />
           </div>
        </div>

        {/* Currency & Trophies */}
        <div className="flex justify-end gap-1.5 mt-1">
           <div className="bg-white/5 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/5">
              <span className="text-[9px] font-black text-white">13.5M</span>
              <div className="w-2.5 h-2.5 bg-cyan-400 rounded-sm rotate-45 flex items-center justify-center">
                 <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
           </div>
           <div className="bg-white/5 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/5">
              <GiftIcon size={10} className="text-pink-400" />
           </div>
           <div className="bg-white/5 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/5">
              <Trophy size={10} className="text-yellow-400" />
           </div>
        </div>
      </div>

      {/* NEW Seats Grid - High End Design */}
      <div className="relative z-10 flex-1 px-4 grid grid-cols-4 gap-x-2 gap-y-12 content-start pt-10 overflow-y-auto no-scrollbar">
        {roomSeats.map((seat, i) => (
          <div key={i} className="flex flex-col items-center gap-2 relative">
            <div className="relative group">
              {/* Speaking Indicator Pulse */}
              {seat.isSpeaking && (
                <div className="absolute inset-[-6px] rounded-full bg-yellow-400/20 animate-ping z-0"></div>
              )}
              
              {/* Seat Container */}
              <div className={`w-[66px] h-[66px] rounded-[22px] flex items-center justify-center relative z-10 overflow-hidden 
                ${seat.user ? 'bg-black/60 border border-white/20 shadow-lg' : 'bg-black/30 border border-white/5 border-dashed'} 
                ${seat.isSpeaking ? 'border-yellow-400 ring-2 ring-yellow-400/20' : ''}`}>
                
                {seat.user ? (
                   <>
                    <img src={seat.user.avatar} className="w-full h-full object-cover" alt="avatar" />
                    {/* Fire Effect */}
                    {seat.user.hasFire && (
                      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-orange-500/30 to-transparent"></div>
                    )}
                   </>
                ) : seat.isLocked ? (
                   <Lock size={16} className="text-zinc-600 opacity-50" />
                ) : (
                   <div className="flex flex-col items-center">
                      <span className="text-[10px] font-black text-zinc-700">{i + 1}</span>
                   </div>
                )}
                
                {/* Micro-status indicator */}
                {seat.user && (
                  <div className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-md p-1 rounded-md border border-white/10">
                    <Mic size={8} className={seat.isSpeaking ? "text-green-400" : "text-zinc-400"} />
                  </div>
                )}
              </div>

              {/* Crown for high levels */}
              {seat.user?.nobleLevel >= 16 && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 drop-shadow-lg">
                  <Crown size={18} className="text-yellow-400 fill-current" />
                </div>
              )}
            </div>
            
            {/* Name Label - Cleaner Design */}
            <div className="flex flex-col items-center w-full px-1">
               <span className={`text-[10px] font-black truncate w-full text-center tracking-tight
                 ${seat.user?.hasFire ? 'text-orange-400 drop-shadow-[0_0_5px_rgba(249,115,22,0.5)]' : 'text-zinc-200'}`}>
                  {seat.user ? seat.user.name : ''}
               </span>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area & Entrance */}
      <div className="relative z-20 px-4 pb-2 shrink-0 flex flex-col gap-2">
         
         {/* Compact Join Notification - Moved to Bottom, Shorter length */}
         {showEntrance && (
           <div className="animate-mini-entrance w-fit max-w-[280px] bg-gradient-to-r from-zinc-900/90 to-transparent backdrop-blur-2xl border-r-2 border-yellow-500 py-1.5 px-3 rounded-l-2xl flex items-center gap-2 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-transparent"></div>
              <div className="relative w-6 h-6 shrink-0">
                 <img src={currentUser.avatar} className="w-full h-full rounded-full border border-yellow-400 shadow-sm" alt="me" />
                 <div className="absolute -top-1 -right-1"><Crown size={10} className="text-yellow-400 fill-current" /></div>
              </div>
              <div className="flex items-center gap-1.5 overflow-hidden">
                 <LevelBadge level={1} type="noble" size="sm" />
                 <p className="text-[10px] font-black text-white italic truncate whitespace-nowrap">
                   <span className="text-yellow-400">{currentUser.name}</span> انضم
                 </p>
              </div>
              <Sparkles size={12} className="text-yellow-500 animate-pulse ml-auto" />
           </div>
         )}

         {/* Chat Messages */}
         <div className="h-44 overflow-y-auto no-scrollbar space-y-2.5 flex flex-col justify-end">
            {messages.map(msg => (
              <div key={msg.id} className="animate-fade-in flex flex-col items-start">
                 <div className="flex flex-col gap-1 bg-black/50 backdrop-blur-3xl p-2 rounded-2xl border border-white/5 w-fit max-w-[85%] shadow-sm">
                    <div className="flex items-center gap-1.5">
                       <LevelBadge level={msg.nobleLevel || 1} type="noble" size="sm" />
                       <LevelBadge level={msg.vipLevel || 5} type="vip" size="sm" />
                       <span className="text-[9px] font-black text-zinc-500">@{msg.user}</span>
                    </div>
                    <p className="text-[10px] font-medium leading-tight text-zinc-100">{msg.text}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Bottom Toolbar - Floating Style */}
      <div className="relative z-30 p-4 pb-8 flex items-center justify-between gap-3 shrink-0">
         <button className="p-3 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 active:scale-90 transition-transform"><Grid size={20} className="text-zinc-200" /></button>
         
         <button 
           onClick={() => setIsMuted(!isMuted)}
           className={`p-3 backdrop-blur-3xl rounded-2xl border border-white/10 active:scale-90 transition-transform ${isMuted ? 'bg-red-600/60' : 'bg-white/5'}`}
         >
           {isMuted ? <MicOff size={20} className="text-white" /> : <Mic size={20} className="text-zinc-200" />}
         </button>
         
         <div className="flex-1 relative">
            <form onSubmit={handleSendMessage}>
               <input 
                 type="text" 
                 value={inputText}
                 onChange={(e) => setInputText(e.target.value)}
                 placeholder="مرحبا بك في غرفتنا" 
                 className="w-full bg-black/60 backdrop-blur-xl border border-white/10 rounded-full py-3.5 pr-4 pl-10 text-[11px] font-bold outline-none focus:border-yellow-500/40 text-white placeholder-zinc-500"
               />
               <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  {inputText.trim().length > 0 ? (
                    <Send size={18} className="text-yellow-500 animate-pulse" />
                  ) : (
                    <MessageCircle size={18} />
                  )}
               </button>
            </form>
         </div>

         {/* Gift Button */}
         <button className="p-0.5 relative group shrink-0" onClick={() => setShowGifts(true)}>
            <div className="absolute inset-0 bg-yellow-500 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
            <div className="relative w-12 h-12 bg-gradient-to-tr from-orange-600 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl border border-white/20 active:scale-90 transition-transform">
               <img src="https://cdn-icons-png.flaticon.com/512/3209/3209955.png" className="w-9 h-9 object-contain" alt="gift" />
            </div>
         </button>
         
         <button className="p-3 bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 relative shrink-0 active:scale-90 transition-transform">
            <Mail size={20} className="text-zinc-200" />
            {privateMessagesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full border border-zinc-950">
                {privateMessagesCount}
              </span>
            )}
         </button>
      </div>

      {/* Gifts Drawer */}
      {showGifts && (
        <div className="fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm flex items-end">
           <div className="w-full bg-zinc-950 rounded-t-[40px] p-6 h-[60vh] flex flex-col animate-slide-up border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex flex-col">
                   <h4 className="text-lg font-black text-white">متجر الهدايا 💎</h4>
                   <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-zinc-500 font-bold">الرصيد:</span>
                      <div className="flex items-center gap-1 bg-yellow-500/10 px-2.5 py-1 rounded-full border border-yellow-500/20">
                         <span className="text-[11px] font-black text-yellow-500">{currentUser.coins.toLocaleString()}</span>
                         <Star size={10} className="text-yellow-500 fill-current" />
                      </div>
                 </div>
                 </div>
                 <button onClick={() => setShowGifts(false)} className="p-2.5 bg-white/5 rounded-full text-zinc-400"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-4 no-scrollbar pb-10 text-center">
                {GIFTS.slice(0, 40).map(gift => (
                  <button key={gift.id} onClick={() => handleGiftSelect(gift)} className="flex flex-col items-center gap-1.5 p-3 bg-white/5 rounded-3xl border border-transparent hover:border-yellow-500 hover:bg-yellow-500/5 active:scale-95 transition-all">
                    <span className="text-3xl drop-shadow-lg">{gift.icon}</span>
                    <span className="text-[9px] font-bold text-zinc-400 truncate w-full">{gift.name}</span>
                    <span className="text-[10px] text-yellow-500 font-black">{gift.price}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        
        @keyframes miniEntrance {
          0% { transform: translateX(100%); opacity: 0; }
          15% { transform: translateX(0); opacity: 1; }
          85% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }
        .animate-mini-entrance {
          animation: miniEntrance 5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default LiveRoom;
