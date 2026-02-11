
import React, { useState, useRef, useEffect } from 'react';
import { Menu, Share, Grid, Heart, Bookmark, Wallet, ChevronRight, UserPlus, MessageCircle, X, ShieldCheck, Banknote, Play, Plus, UserCheck } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { Post, AppRoute, User, ActivityItem } from '../types';
import Feed from './Feed';
import VerifiedBadge from '../components/VerifiedBadge';
import LevelBadge from '../components/LevelBadge';

interface ProfileProps {
  posts: Post[];
  userId?: string | null;
  currentUser: User;
  onBack?: () => void;
  onNavigate?: (route: AppRoute) => void;
  onDeletePost?: (postId: string) => void;
  onUpdatePrivacy?: (postId: string, privacy: Post['privacy']) => void;
  onShareToStory?: (post: Post) => void;
  onUpdateUser?: (id: string, updates: Partial<User>) => void;
}

const Profile: React.FC<ProfileProps> = ({ posts, userId, currentUser, onBack, onNavigate, onDeletePost, onUpdatePrivacy, onShareToStory, onUpdateUser }) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'liked' | 'saved'>('posts');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const isOwnProfile = !userId || userId === currentUser.id;
  
  const allUsers: User[] = JSON.parse(localStorage.getItem('tikbook_all_users') || '[]');
  const profileUser = isOwnProfile ? currentUser : (allUsers.find(u => u.id === userId) || {
    id: userId,
    name: 'مستخدم تيك بوك',
    username: `user_${userId?.substring(0, 5)}`,
    avatar: `https://picsum.photos/200/200?u=${userId}`,
    bio: 'مرحباً بكم في ملفي الشخصي ✨',
    followers: 8400,
    following: 210,
    likes: 45000,
    coins: 0,
    earnings: 0,
    role: 'user',
    status: 'active',
    isVerified: false,
    supporterLevel: 1
  } as User);

  const userPosts = posts.filter(p => p.userId === profileUser.id);
  const isVerified = profileUser.isVerified || profileUser.role === 'admin';

  const handleFollow = () => {
    if (isFollowed) {
      setIsFollowed(false);
    } else {
      setIsFollowed(true);
      // إرسال إشعار نشاط للمستخدم الآخر
      const activity: ActivityItem = {
        id: `act-${Date.now()}`,
        userId: profileUser.id,
        type: 'follow',
        fromUserId: currentUser.id,
        fromUserName: currentUser.name,
        fromUserAvatar: currentUser.avatar,
        timestamp: new Date().toISOString()
      };
      const saved = JSON.parse(localStorage.getItem('tikbook_activities') || '[]');
      localStorage.setItem('tikbook_activities', JSON.stringify([activity, ...saved]));
    }
  };

  const formatViews = (count: number) => {
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateUser) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onUpdateUser(profileUser.id, { avatar: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full bg-black text-white flex flex-col overflow-y-auto no-scrollbar" dir="rtl" style={{ height: 'calc(100vh - 84px)' }}>
      <div className="flex justify-between items-center p-4 sticky top-0 bg-black/80 backdrop-blur-md z-10 shrink-0">
        <div className="flex items-center gap-2">
           {onBack && !isOwnProfile ? <button onClick={onBack} className="p-1"><ChevronRight size={24} /></button> : <button className="p-2"><Share size={24} /></button>}
        </div>
        <div className="flex items-center gap-1.5">
          <h2 className="text-lg font-bold">@{profileUser.username}</h2>
          {isVerified && <VerifiedBadge size={18} />}
        </div>
        <div className="flex items-center gap-2">
          {isOwnProfile && profileUser.role === 'admin' && onNavigate && (
            <button onClick={() => onNavigate(AppRoute.ADMIN)} className="p-2 bg-yellow-500 text-black rounded-full shadow-lg active:scale-90 transition-all"><ShieldCheck size={20} /></button>
          )}
          {isOwnProfile && onNavigate && (
            <button onClick={() => onNavigate(AppRoute.SETTINGS)} className="p-2 hover:bg-white/5 rounded-full"><Menu size={24} /></button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center mt-4 px-4 shrink-0">
        <div className="relative group">
          <div className={`relative w-24 h-24 rounded-full border-2 p-0.5 object-cover overflow-hidden ${profileUser.supporterLevel >= 30 || isVerified ? 'border-yellow-500' : 'border-zinc-800'}`}>
             <img src={profileUser.avatar} className="w-full h-full rounded-full object-cover" />
          </div>
          {isOwnProfile && (
            <>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[#00b2ff] text-white p-1.5 rounded-full border-2 border-black shadow-lg active:scale-90 transition-all z-20"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
              <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            </>
          )}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-10">
             <LevelBadge level={profileUser.supporterLevel || 1} size="sm" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <h1 className="text-xl font-bold">{profileUser.name}</h1>
          {isVerified && <VerifiedBadge size={22} />}
        </div>
        <p className="text-sm text-zinc-400 mt-1 max-w-xs text-center">{profileUser.bio}</p>

        <div className="flex gap-10 mt-8">
          <div className="flex flex-col items-center"><span className="font-bold text-lg">{profileUser.following}</span><span className="text-zinc-500 text-xs">متابعة</span></div>
          <div className="flex flex-col items-center"><span className="font-bold text-lg">{(profileUser.followers / 1000).toFixed(1)}K</span><span className="text-zinc-500 text-xs">متابعين</span></div>
          <div className="flex flex-col items-center"><span className="font-bold text-lg">{(profileUser.likes / 1000).toFixed(1)}K</span><span className="text-zinc-500 text-xs">إعجابات</span></div>
        </div>

        <div className="flex flex-wrap gap-2 mt-8 w-full px-2">
          {isOwnProfile ? (
            <>
              <button onClick={() => onNavigate?.(AppRoute.EDIT_PROFILE)} className="flex-1 bg-zinc-800 py-3 rounded-xl font-bold text-sm">تعديل الملف</button>
              <button onClick={() => onNavigate?.(AppRoute.SUPPORTER_LEVEL)} className="flex-1 bg-zinc-800 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                 <LevelBadge level={profileUser.supporterLevel} size="sm" /> الداعمين
              </button>
              <button onClick={() => onNavigate?.(AppRoute.EARNINGS)} className="w-full bg-yellow-500 text-black py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 mt-1 shadow-lg shadow-yellow-500/10"><Banknote size={18} /> محفظة الأرباح (ج.م)</button>
            </>
          ) : (
            <>
              <button 
                onClick={handleFollow}
                className={`flex-[2] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${isFollowed ? 'bg-zinc-800 text-white' : 'bg-yellow-500 text-black'}`}
              >
                {isFollowed ? <><UserCheck size={18} /> متابع</> : <><UserPlus size={18} /> متابعة</>}
              </button>
              <button className="flex-1 bg-zinc-800 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"><MessageCircle size={18} /> رسالة</button>
            </>
          )}
        </div>
      </div>

      <div className="mt-10 border-t border-white/5 flex flex-col flex-1">
        <div className="flex sticky top-0 bg-black z-10 shrink-0">
          {['posts', 'liked', 'saved'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={`flex-1 py-4 flex justify-center items-center relative ${activeTab === tab ? 'text-white' : 'text-zinc-600'}`}>
              {tab === 'posts' ? <Grid size={20} /> : tab === 'liked' ? <Heart size={20} /> : <Bookmark size={20} />}
              {activeTab === tab && <div className="absolute bottom-0 w-12 h-0.5 bg-yellow-500"></div>}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-0.5 mt-0.5 pb-20">
          {userPosts.map((post) => (
            <div key={post.id} onClick={() => setSelectedPostId(post.id)} className="aspect-[3/4] bg-zinc-900 relative overflow-hidden group cursor-pointer">
              <img src={post.thumbnail || post.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[10px] bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full font-bold">
                <Play size={10} fill="white" className="text-white" /> {formatViews(post.views || 0)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPostId && (
        <div className="fixed inset-0 z-[500] bg-black flex flex-col animate-fade-in">
          <button onClick={() => setSelectedPostId(null)} className="absolute top-12 left-4 z-[510] p-3 bg-black/40 backdrop-blur-md rounded-full text-white active:scale-90 transition-transform shadow-xl border border-white/10">
            <ChevronRight size={24} />
          </button>
          <div className="flex-1 overflow-hidden">
            <Feed 
              posts={userPosts.filter(p => p.id === selectedPostId).concat(userPosts.filter(p => p.id !== selectedPostId))} 
              onProfileNavigate={(id) => { if (id !== profileUser.id) { setSelectedPostId(null); onBack?.(); } }}
              onDeletePost={onDeletePost}
              onUpdatePrivacy={onUpdatePrivacy}
              onShareToStory={onShareToStory}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
