
import React, { useState } from 'react';
import { X, Send, Gift as GiftIcon, Heart } from 'lucide-react';
import { GIFTS, MOCK_USER } from '../constants';
import { Gift, ActivityItem, Post } from '../types';

interface CommentSheetProps {
  post?: Post; // إضافة المنشور للسياق
  onClose: () => void;
  onSendGift: (gift: Gift) => void;
}

const CommentSheet: React.FC<CommentSheetProps> = ({ post, onClose, onSendGift }) => {
  const [comments, setComments] = useState([
    { id: 1, user: 'فهد الأحمد', text: 'مبدع كالعادة استمر 🔥', likes: 12, time: '2س' },
    { id: 2, user: 'نورة علي', text: 'ما شاء الله الصوت خيال 😍', likes: 5, time: '1س' },
  ]);
  const [text, setText] = useState('');
  const [showGifts, setShowGifts] = useState(false);
  
  const currentUser = JSON.parse(localStorage.getItem('tikbook_user') || JSON.stringify(MOCK_USER));

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const newComment = { id: Date.now(), user: currentUser.name, text, likes: 0, time: 'الآن' };
    setComments([newComment, ...comments]);
    
    // إرسال إشعار نشاط إذا كان هناك منشور مربوط
    if (post && post.userId !== currentUser.id) {
       const activity: ActivityItem = {
          id: `act-${Date.now()}`,
          userId: post.userId,
          type: 'comment',
          fromUserId: currentUser.id,
          fromUserName: currentUser.name,
          fromUserAvatar: currentUser.avatar,
          timestamp: new Date().toISOString(),
          postThumb: post.thumbnail,
          text: text
       };
       const saved = JSON.parse(localStorage.getItem('tikbook_activities') || '[]');
       localStorage.setItem('tikbook_activities', JSON.stringify([activity, ...saved]));
    }
    
    setText('');
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose}></div>
      
      {/* Sheet Content */}
      <div className="w-full bg-[#121212] rounded-t-[24px] h-[70vh] relative flex flex-col animate-slide-up border-t border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center">
          <span className="text-sm font-black text-white">التعليقات</span>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 no-scrollbar">
          {comments.map(c => (
            <div key={c.id} className="flex gap-4">
              <img src={`https://picsum.photos/40/40?u=${c.id}`} className="w-10 h-10 rounded-full object-cover border border-white/5" />
              <div className="flex-1 text-right">
                <p className="text-[11px] text-zinc-500 mb-1 font-bold">{c.user} • {c.time}</p>
                <p className="text-sm text-zinc-200 leading-relaxed">{c.text}</p>
              </div>
              <div className="flex flex-col items-center gap-1 text-zinc-500">
                <Heart size={18} className="hover:text-red-500 cursor-pointer transition-colors" />
                <span className="text-[10px] font-bold">{c.likes}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#181818] border-t border-white/10 pb-[57px]">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <button 
              type="button" 
              onClick={() => setShowGifts(!showGifts)}
              className="p-2 text-yellow-500 hover:scale-110 transition-transform active:scale-90"
            >
              <GiftIcon size={26} />
            </button>
            <div className="flex-1 relative">
              <input 
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 px-5 text-sm focus:outline-none focus:border-yellow-500/50 transition-all text-white text-right"
                placeholder="أضف تعليقاً..."
              />
            </div>
            <button type="submit" className="text-white bg-[#ff0050] p-2.5 rounded-full shadow-lg active:scale-90 transition-transform">
              <Send size={20} />
            </button>
          </form>

          {showGifts && (
            <div className="grid grid-cols-4 gap-3 mt-4 animate-fade-in">
              {GIFTS.slice(0, 4).map(g => (
                <button 
                  key={g.id} 
                  onClick={() => { onSendGift(g); setShowGifts(false); }}
                  className="flex flex-col items-center p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-yellow-500/50 transition-all"
                >
                  <span className="text-3xl">{g.icon}</span>
                  <span className="text-[10px] font-black mt-1 text-yellow-500">{g.price}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSheet;
