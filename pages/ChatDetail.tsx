
import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Phone, Video, Send, Gift as GiftIcon, Mic, Image as ImageIcon, X, UserPlus, Loader2, Smile, Trash2, Edit3, Check, Wallet } from 'lucide-react';
import { MOCK_CHATS, GIFTS, MOCK_USER } from '../constants';
import { Gift, User } from '../types';

const ChatDetail: React.FC<{ chatId: string; onBack: () => void; onProfileClick?: (userId: string) => void }> = ({ chatId, onBack, onProfileClick }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('tikbook_user');
    return saved ? JSON.parse(saved) : MOCK_USER;
  });

  const chat = chatId === 'dummy' ? {
    id: 'dummy',
    user: { id: 'support', name: 'فريق دعم تيك بوك 🛡️', username: 'support', avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', bio: '', followers: 0, following: 0, likes: 0, coins: 0, isOnline: true, role: 'admin', status: 'active' },
    lastMessage: '',
    timestamp: '',
    unreadCount: 0
  } : (MOCK_CHATS.find(c => c.id === chatId) || MOCK_CHATS[0]);

  const [messages, setMessages] = useState<any[]>([
    { id: '1', text: 'أهلاً بك في تيك بوك! ميزة الدردشة الجديدة وصلت 🚀', isMe: false, type: 'text', reactions: [] },
  ]);
  const [inputText, setInputText] = useState('');
  const [showGifts, setShowGifts] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [followed, setFollowed] = useState(false);
  const [longPressedMsgId, setLongPressedMsgId] = useState<string | null>(null);
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [activeSpecialGift, setActiveSpecialGift] = useState<Gift | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<any>(null);
  const whaleVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordTime(p => p + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      setRecordTime(0);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const sendMessage = (text?: string, type: 'text' | 'image' | 'voice' | 'gift' = 'text', content?: string, giftIcon?: string) => {
    if (editingMsgId) {
      setMessages(prev => prev.map(m => m.id === editingMsgId ? { ...m, text: inputText, isEdited: true } : m));
      setEditingMsgId(null);
      setInputText('');
      return;
    }

    const body = text || inputText;
    if (!body.trim() && !content && !giftIcon) return;
    setMessages(prev => [...prev, { 
      id: Date.now().toString(), 
      text: body, 
      isMe: true, 
      type,
      content,
      giftIcon,
      reactions: []
    }]);
    setInputText('');
  };

  const handleLongPressStart = (msg: any) => {
    longPressTimer.current = setTimeout(() => {
      setLongPressedMsgId(msg.id);
      if (window.navigator.vibrate) window.navigator.vibrate(80);
    }, 5000); 
  };

  const handleLongPressEnd = () => {
    clearTimeout(longPressTimer.current);
  };

  const addReaction = (msgId: string, emoji: string) => {
    setMessages(prev => prev.map(m => 
      m.id === msgId ? { ...m, reactions: [...(m.reactions || []), emoji].slice(-3) } : m
    ));
    setLongPressedMsgId(null);
  };

  const deleteMessage = (msgId: string) => {
    setMessages(prev => prev.filter(m => m.id !== msgId));
    setLongPressedMsgId(null);
  };

  const handleMessageInteraction = (msg: any, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation(); 
    if (msg.type === 'image') {
      setLongPressedMsgId(msg.id);
    } else if (msg.type === 'text') {
      if (msg.isMe) {
        setEditingMsgId(msg.id);
        setInputText(msg.text);
      }
    }
  };

  // Fix: handleCall function for voice and video call buttons (fixes missing name error on lines 161, 162)
  const handleCall = (type: 'voice' | 'video') => {
    alert(`بدء مكالمة ${type === 'voice' ? 'صوتية' : 'فيديو'} مع ${chat.user.name}...`);
  };

  const handleGift = (gift: Gift) => {
    if (currentUser.coins < gift.price) {
      alert('رصيدك غير كافٍ لشراء هذه الهدية!');
      return;
    }

    // تحديث رصيد المستخدم (خصم العملات)
    const updatedUser = { ...currentUser, coins: currentUser.coins - gift.price };
    setCurrentUser(updatedUser);
    localStorage.setItem('tikbook_user', JSON.stringify(updatedUser));

    if (gift.id === 'g18' || gift.id === 'g19') {
      setActiveSpecialGift(gift);
      if (gift.id === 'g18') {
        const roar = new Audio('https://www.soundjay.com/nature/sounds/lion-roar-01.mp3');
        roar.volume = 0.6;
        roar.play().catch(e => console.log('Lion Audio failed', e));
      }
      setTimeout(() => setActiveSpecialGift(null), gift.id === 'g18' ? 5000 : 7500);
    }

    sendMessage(`أرسل لك هدية: ${gift.name}`, 'gift', undefined, gift.icon);
    setShowGifts(false);
  };

  return (
    <div className="fixed inset-0 z-[150] bg-[#F9F9F9] text-black flex flex-col font-sans overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-white border-b border-zinc-100 shadow-sm sticky top-0 z-50 shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1 active:scale-90 transition-transform"><ChevronRight size={28} /></button>
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onProfileClick?.(chat.user.id)}>
            <div className="relative">
              <img src={chat.user.avatar} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
              {chat.user.isOnline && <div className="absolute bottom-0 left-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
            </div>
            <div>
              <h3 className="font-bold text-xs text-zinc-900">{chat.user.name}</h3>
              <p className="text-[9px] text-green-600 font-bold">متصل الآن</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button 
            onClick={() => setFollowed(!followed)} 
            className={`${followed ? 'bg-zinc-100 text-zinc-500' : 'bg-[#ff2d55] text-white'} text-[10px] px-4 py-1.5 rounded-full font-black flex items-center gap-1 active:scale-95 transition-all shadow-sm`}
           >
             {followed ? 'متابع' : <><UserPlus size={12} strokeWidth={3} /> متابعة</>}
           </button>
           <button onClick={() => handleCall('voice')} className="p-2 text-zinc-500 active:bg-zinc-50 rounded-full transition-colors"><Phone size={20} /></button>
           <button onClick={() => handleCall('video')} className="p-2 text-zinc-500 active:bg-zinc-50 rounded-full transition-colors"><Video size={22} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef} 
        onClick={() => setLongPressedMsgId(null)} 
        className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-20 bg-zinc-50/30 relative"
      >
        {activeSpecialGift && (
          <div className="fixed inset-0 z-[500] pointer-events-none flex flex-col items-center justify-center overflow-hidden bg-black/10 backdrop-blur-[1px]">
             {activeSpecialGift.id === 'g18' && (
               <div className="animate-lion-tiktok flex flex-col items-center">
                  <span className="text-[180px] filter drop-shadow-[0_0_50px_rgba(234,179,8,0.9)] select-none">🦁</span>
                  <div className="mt-4 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-10 py-3 rounded-full font-black text-2xl shadow-2xl border-2 border-white/50 animate-bounce">
                     زئير الأسد الملكي! 👑
                  </div>
               </div>
             )}
             {activeSpecialGift.id === 'g19' && (
               <div className="w-full h-full flex flex-col items-center justify-center relative">
                  <video 
                    ref={whaleVideoRef}
                    autoPlay 
                    className="w-full h-full object-cover md:object-contain scale-110"
                    onLoadedData={(e) => (e.target as HTMLVideoElement).play()}
                  >
                    <source src="https://static.videezy.com/system/resources/previews/000/012/614/original/whale-jumping.mp4" type="video/mp4" />
                  </video>
                  <div className="absolute bottom-20 bg-gradient-to-r from-blue-700/80 to-cyan-500/80 text-white px-12 py-4 rounded-full font-black text-3xl shadow-[0_0_40px_rgba(59,130,246,0.6)] border-2 border-white/30 animate-pulse-slow">
                     قفزة الحوت العملاقة! 🐋🌊
                  </div>
               </div>
             )}
          </div>
        )}

        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isMe ? 'justify-start' : 'justify-end'}`}>
            <div 
              onMouseDown={() => handleLongPressStart(msg)}
              onMouseUp={handleLongPressEnd}
              onTouchStart={() => handleLongPressStart(msg)}
              onTouchEnd={handleLongPressEnd}
              onClick={(e) => handleMessageInteraction(msg, e)}
              className={`max-w-[85%] px-4 py-3 rounded-2xl relative shadow-sm transition-all active:scale-[0.98] ${
                msg.isMe ? 'bg-[#ff2d55] text-white' : 'bg-white text-zinc-800 border border-zinc-100'
              } ${msg.type === 'gift' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold' : ''} ${editingMsgId === msg.id ? 'ring-2 ring-yellow-400' : ''}`}
            >
              {longPressedMsgId === msg.id && (
                <div 
                  className="absolute -top-12 right-0 bg-white shadow-2xl rounded-full p-1.5 flex gap-2 animate-bounce-slow border border-zinc-100 z-[100]"
                  onClick={(e) => e.stopPropagation()}
                >
                   {['❤️', '😂', '😮', '😢', '🔥'].map(emoji => (
                     <button key={emoji} onClick={() => addReaction(msg.id, emoji)} className="text-lg hover:scale-125 transition-transform">{emoji}</button>
                   ))}
                   <div className="w-px h-6 bg-zinc-100 mx-1"></div>
                   <button onClick={() => deleteMessage(msg.id)} className="text-red-500 p-1"><Trash2 size={16} /></button>
                </div>
              )}
              {msg.type === 'image' && <div className="relative"><img src={msg.content} className="w-56 rounded-xl mb-1 object-cover shadow-sm border border-white/20" /></div>}
              {msg.type === 'voice' && <div className="flex items-center gap-2"><Mic size={16} /> <span className="text-sm font-bold italic">رسالة صوتية ({msg.text})</span></div>}
              {msg.type === 'gift' && msg.giftIcon && (
                <div className="flex items-center gap-3">
                  {msg.giftIcon.startsWith('http') ? <img src={msg.giftIcon} className="w-12 h-12 object-contain" /> : <span className="text-3xl">{msg.giftIcon}</span>}
                  <span className="text-xs">{msg.text}</span>
                </div>
              )}
              {msg.type === 'text' && (
                <div>
                   <p className="text-[14px] font-medium leading-relaxed">{msg.text}</p>
                   {msg.isEdited && <span className="text-[7px] opacity-60 mt-0.5 block font-bold text-left italic">تم التعديل</span>}
                </div>
              )}
              <span className={`text-[8px] absolute -bottom-4 ${msg.isMe ? 'left-0' : 'right-0'} text-zinc-400 font-bold`}>11:42 م</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-zinc-100 p-3 pb-8 shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-zinc-100 rounded-full flex items-center px-4 py-1 border border-zinc-200 shadow-inner">
             <button onClick={() => setShowGifts(true)} className="text-yellow-600 ml-2 active:scale-110 transition-transform"><GiftIcon size={22} /></button>
             <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="أرسل رسالة..." 
                className="flex-1 bg-transparent border-none focus:ring-0 text-[14px] py-2.5 text-zinc-800 font-medium"
             />
             <button onClick={() => fileInputRef.current?.click()} className="text-zinc-500 mr-2 active:scale-110 transition-transform"><ImageIcon size={22} /></button>
          </div>
          <button 
              onClick={() => sendMessage()} 
              className={`w-11 h-11 bg-[#ff2d55] text-white rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-transform`}
            >
              <Send size={20} className="mr-0.5" />
          </button>
        </div>
      </div>

      {/* Gifts Drawer */}
      {showGifts && (
        <div className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-end">
           <div className="w-full bg-white rounded-t-[40px] p-6 h-[65vh] flex flex-col animate-slide-up shadow-2xl border-t border-zinc-100">
              <div className="flex justify-between items-center mb-6">
                 <div className="flex flex-col">
                   <h4 className="text-lg font-black text-zinc-900">إرسال هدية مميزة 🎁</h4>
                   <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] text-zinc-400 font-bold">رصيدك:</span>
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-0.5 rounded-full">
                         <span className="text-[11px] font-black text-yellow-700">{currentUser.coins.toLocaleString()}</span>
                         <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      </div>
                   </div>
                 </div>
                 <button onClick={() => setShowGifts(false)} className="p-2 bg-zinc-100 rounded-full text-zinc-500"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto grid grid-cols-4 gap-4 no-scrollbar pb-10">
                {GIFTS.slice(0, 40).map(gift => (
                  <button key={gift.id} onClick={() => handleGift(gift)} className="flex flex-col items-center gap-1.5 p-3 bg-zinc-50 rounded-3xl border border-transparent hover:border-yellow-500 active:scale-95 transition-all">
                    {gift.icon.startsWith('http') ? <img src={gift.icon} className="w-10 h-10 object-contain" /> : <span className="text-3xl">{gift.icon}</span>}
                    <span className="text-[10px] font-bold text-zinc-600 truncate w-full text-center">{gift.name}</span>
                    <span className="text-[10px] text-yellow-600 font-black">💰 {gift.price}</span>
                  </button>
                ))}
              </div>
           </div>
        </div>
      )}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
      <style>{`
        @keyframes lion-tiktok { 0% { transform: scale(0.2) translateY(300px); opacity: 0; } 20% { transform: scale(1.1) translateY(0); opacity: 1; } 50% { transform: scale(1.2) translateY(-20px); filter: drop-shadow(0 0 80px orange); } 100% { opacity: 0; transform: scale(0.5) translateY(-300px); } }
        .animate-lion-tiktok { animation: lion-tiktok 5s ease-in-out forwards; }
        .animate-pulse-slow { animation: pulse 3s infinite; }
        .animate-bounce-slow { animation: bounce 2s infinite; }
        .animate-slide-up { animation: slideUp 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default ChatDetail;
