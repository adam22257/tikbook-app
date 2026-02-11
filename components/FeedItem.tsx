
import React, { useState, useRef, useEffect } from 'react';
import { Post, User as UserType, ActivityItem } from '../types';
import { Heart, MessageCircle, Redo2, Bookmark, Search, Tv, Plus, ChevronLeft, X, Link, MessageSquare, Instagram, Facebook, MoreHorizontal, Download, Flag, Play, Pause, Trash2, Edit3, Globe, Lock, Users, History } from 'lucide-react';
import { MOCK_CHATS, MOCK_USER } from '../constants';
import VerifiedBadge from './VerifiedBadge';

interface FeedItemProps {
  post: Post;
  isActive: boolean;
  onSendGift: (gift: any) => void;
  onCommentClick: () => void;
  onProfileClick: (userId: string) => void;
  onDeletePost?: (postId: string) => void;
  onUpdatePrivacy?: (postId: string, privacy: Post['privacy']) => void;
  onShareToStory?: (post: Post) => void;
}

const FeedItem: React.FC<FeedItemProps> = ({ post, isActive, onCommentClick, onProfileClick, onDeletePost, onUpdatePrivacy, onShareToStory }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showStatusIcon, setShowStatusIcon] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentUser = JSON.parse(localStorage.getItem('tikbook_user') || JSON.stringify(MOCK_USER));
  const isOwnPost = post.userId === currentUser.id;

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    setShowStatusIcon(true);
    setTimeout(() => setShowStatusIcon(false), 500);
  };

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      // إرسال إشعار لصاحب المنشور (إذا لم يكن منشوري)
      if (post.userId !== currentUser.id) {
        const activity: ActivityItem = {
          id: `act-${Date.now()}`,
          userId: post.userId,
          type: 'like',
          fromUserId: currentUser.id,
          fromUserName: currentUser.name,
          fromUserAvatar: currentUser.avatar,
          timestamp: new Date().toISOString(),
          postThumb: post.thumbnail
        };
        const savedActs = JSON.parse(localStorage.getItem('tikbook_activities') || '[]');
        localStorage.setItem('tikbook_activities', JSON.stringify([activity, ...savedActs]));
      }
    } else {
      setLiked(false);
    }
  };

  const allUsers: UserType[] = JSON.parse(localStorage.getItem('tikbook_all_users') || '[]');
  const author = allUsers.find(u => u.id === post.userId) || (post.userId === currentUser.id ? currentUser : null);
  const isVerified = author?.isVerified || author?.role === 'admin';
  const displayName = author?.name || (post.userId === 'u1' ? 'أحمد مشعل' : 'مستخدم تيك بوك');

  const shareOptions = [
    { icon: <Link size={24} />, name: 'نسخ الرابط', color: 'bg-zinc-800' },
    { icon: <img src="https://cdn-icons-png.flaticon.com/512/3670/3670051.png" className="w-6 h-6" />, name: 'واتساب', color: 'bg-green-600' },
    { icon: <MessageSquare size={24} />, name: 'SMS', color: 'bg-blue-500' },
    { icon: <Facebook size={24} />, name: 'فيسبوك', color: 'bg-blue-700' },
    { icon: <Instagram size={24} />, name: 'قصص', color: 'bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500' },
  ];

  const privacyOptions = [
    { id: 'public', name: 'عام', icon: <Globe size={18} /> },
    { id: 'followers', name: 'المتابعون', icon: <Users size={18} /> },
    { id: 'private', name: 'أنا فقط', icon: <Lock size={18} /> },
  ];

  return (
    <div className="relative h-full w-full bg-black overflow-hidden font-sans">
      <div className="absolute inset-0 h-full w-full" onClick={togglePlay}>
        {post.type === 'video' ? (
          <video
            ref={videoRef}
            src={post.url}
            className="h-full w-full object-cover"
            loop
            playsInline
            muted={!isActive}
          />
        ) : (
          <img src={post.url} className="h-full w-full object-cover" alt={post.description} />
        )}
        
        {showStatusIcon && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-full animate-ping-once">
              {isPlaying ? <Play size={48} fill="white" className="text-white" /> : <Pause size={48} fill="white" className="text-white" />}
            </div>
          </div>
        )}
      </div>

      <div className="absolute left-2 bottom-[95px] z-50 flex flex-col items-center gap-4">
        <div className="relative mb-3">
          <div onClick={() => onProfileClick(post.userId)} className={`w-[52px] h-[52px] rounded-full border-2 ${isVerified ? 'border-blue-500' : 'border-white'} overflow-hidden bg-zinc-800 cursor-pointer shadow-xl active:scale-95 transition-transform`}>
            <img src={author?.avatar || `https://picsum.photos/200/200?u=${post.userId}`} className="w-full h-full object-cover" />
          </div>
          {!followed && (
            <button onClick={(e) => { e.stopPropagation(); setFollowed(true); }} className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#ff0050] text-white rounded-full p-0.5 shadow-2xl border-2 border-black">
              <Plus size={16} strokeWidth={4} />
            </button>
          )}
        </div>
        <div className="flex flex-col items-center">
          <button onClick={handleLike} className="active:scale-125 transition-transform"><Heart size={40} fill={liked ? "#ff0050" : "white"} stroke="none" className="drop-shadow-2xl" /></button>
          <span className="text-white text-[13px] font-bold mt-1 drop-shadow-lg">{liked ? post.likes + 1 : post.likes}</span>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={onCommentClick} className="active:scale-110"><MessageCircle size={40} fill="white" stroke="none" className="drop-shadow-2xl" /></button>
          <span className="text-white text-[13px] font-bold mt-1 drop-shadow-lg">{post.comments}</span>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={() => setSaved(!saved)} className="active:scale-110"><Bookmark size={40} fill={saved ? "#eab308" : "white"} stroke="none" className="drop-shadow-2xl" /></button>
          <span className="text-white text-[13px] font-bold mt-1 drop-shadow-lg">289</span>
        </div>
        <div className="flex flex-col items-center">
          <button onClick={() => setShowShareSheet(true)} className="active:scale-110"><Redo2 size={40} className="text-white drop-shadow-2xl -scale-x-100" /></button>
          <span className="text-white text-[13px] font-bold mt-1 drop-shadow-lg">{post.shares}</span>
        </div>
        <div className="w-11 h-11 rounded-full border-[8px] border-zinc-900/90 animate-disk mt-4 overflow-hidden shadow-2xl ring-2 ring-white/10">
          <img src="https://picsum.photos/100/100?u=music" className="w-full h-full object-cover" />
        </div>
      </div>

      <div className="absolute bottom-[90px] left-[75px] right-4 z-40 flex flex-col items-start pointer-events-none space-y-4">
        <div className="flex flex-col items-start text-right w-full">
          <div className="bg-white/10 backdrop-blur-md px-2.5 py-1 rounded text-white text-[11px] font-black mb-2 border border-white/10 tracking-wide">من اقوى الاصوات</div>
          <div className="flex items-center gap-1.5 mb-1 pointer-events-auto cursor-pointer" onClick={() => onProfileClick(post.userId)}>
            <h3 className="text-white font-black text-[17px] drop-shadow-2xl">{displayName}</h3>
            {isVerified && <VerifiedBadge size={16} />}
          </div>
          <p className="text-white text-[15px] leading-relaxed drop-shadow-lg w-full">{post.description} <span className="font-black text-yellow-500">#تيك_بوك</span></p>
        </div>
        <div className="flex items-center justify-start w-full pointer-events-auto gap-3">
          <div className="flex items-center gap-2 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 max-w-full">
            <Search size={14} className="text-white/70" />
            <span className="text-white text-[12px] font-bold truncate max-w-[150px]">البحث . {post.musicTitle}</span>
          </div>
          <ChevronLeft size={20} className="text-white/60" />
        </div>
      </div>
      
      {showShareSheet && (
        <div className="fixed inset-0 z-[1000] flex items-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" onClick={() => setShowShareSheet(false)}></div>
          <div className="w-full bg-[#121212] rounded-t-[32px] animate-slide-up border-t border-white/10 pb-[73px] shadow-2xl overflow-y-auto max-h-[85vh] no-scrollbar relative z-[1001]">
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-4 shrink-0"></div>
            
            <div className="px-6 flex justify-between items-center mb-6">
              <h4 className="text-xl font-black text-white">خيارات الفيديو</h4>
              <button onClick={() => setShowShareSheet(false)} className="text-zinc-500 p-2 hover:text-white"><X size={26} /></button>
            </div>

            {isOwnPost && (
              <div className="mb-8 px-6">
                <div className="flex justify-end mb-4"><span className="text-xs font-bold text-zinc-400">خصوصية الفيديو</span></div>
                <div className="flex gap-4 justify-end">
                  {privacyOptions.map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => onUpdatePrivacy?.(post.id, opt.id as any)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all ${post.privacy === opt.id ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : 'border-white/5 text-zinc-400'}`}
                    >
                      {opt.icon}
                      <span className="text-[10px] font-bold">{opt.name}</span>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button 
                    onClick={() => { setShowShareSheet(false); onDeletePost?.(post.id); }}
                    className="flex-1 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Trash2 size={16} /> حذف
                  </button>
                  <button className="flex-1 bg-zinc-800 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all">
                    <Edit3 size={16} /> تعديل
                  </button>
                  <button 
                    onClick={() => { setShowShareSheet(false); onShareToStory?.(post); }}
                    className="flex-1 bg-yellow-500 text-black py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <History size={16} /> للقصة
                  </button>
                </div>
              </div>
            )}

            {!isOwnPost && (
               <div className="mb-8 px-6 flex justify-end">
                  <button 
                    onClick={() => { setShowShareSheet(false); onShareToStory?.(post); }}
                    className="w-full bg-zinc-800 text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <History size={20} /> نشر الفيديو في قصتي
                  </button>
               </div>
            )}

            <div className="mb-8">
              <div className="px-6 flex justify-end mb-4"><span className="text-xs font-bold text-zinc-400">إرسال إلى</span></div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar px-6 flex-row-reverse">
                {MOCK_CHATS.map(chat => (
                  <div key={chat.id} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer active:scale-95 transition-transform">
                    <div className="relative">
                      <img src={chat.user.avatar} className="w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-yellow-500 transition-colors" />
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1 rounded-full border-2 border-[#121212]"><Plus size={10} className="text-white" /></div>
                    </div>
                    <span className="text-[10px] font-bold text-zinc-300 truncate w-16 text-center">{chat.user.name.split(' ')[0]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="px-6 mb-4 flex justify-end"><span className="text-xs font-bold text-zinc-400">مشاركة في</span></div>
              <div className="flex gap-6 overflow-x-auto no-scrollbar px-6 pb-2 flex-row-reverse">
                {shareOptions.map((opt, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer active:scale-95 transition-transform">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white ${opt.color} shadow-lg ring-4 ring-white/5`}>{opt.icon}</div>
                    <span className="text-[10px] font-bold text-zinc-300">{opt.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .animate-slide-up {
          animation: slideUp 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FeedItem;
