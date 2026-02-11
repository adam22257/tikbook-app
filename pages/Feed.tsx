
import React, { useState, useEffect, useRef } from 'react';
import FeedItem from '../components/FeedItem';
import CommentSheet from '../components/CommentSheet';
import { Search, Tv } from 'lucide-react';
import { Post, Gift, AppRoute } from '../types';

interface FeedProps {
  onProfileNavigate: (userId: string) => void;
  posts: Post[];
  onDeletePost?: (postId: string) => void;
  onUpdatePrivacy?: (postId: string, privacy: Post['privacy']) => void;
  onShareToStory?: (post: Post) => void;
}

const Feed: React.FC<FeedProps> = ({ onProfileNavigate, posts, onDeletePost, onUpdatePrivacy, onShareToStory }) => {
  const [activeGift, setActiveGift] = useState<Gift | null>(null);
  const [showComments, setShowComments] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(posts[0]?.id || null);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const options = {
      root: feedContainerRef.current,
      threshold: 0.6,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActivePostId(entry.target.getAttribute('data-id'));
        }
      });
    }, options);

    const items = feedContainerRef.current?.querySelectorAll('.snap-item');
    items?.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, [posts]);

  const handleSendGift = (gift: Gift) => {
    setActiveGift(gift);
    setTimeout(() => setActiveGift(null), 3000);
  };

  const currentActivePost = posts.find(p => p.id === activePostId);

  return (
    <div className="h-full w-full bg-black relative">
      {/* التاب العلوي الثابت */}
      <div className="absolute top-0 left-0 right-0 z-[110] flex items-center justify-between px-4 pt-12 pb-10 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <button className="text-white drop-shadow-lg p-1 active:scale-90 transition-transform pointer-events-auto">
          <Search size={26} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-4 pointer-events-auto">
          <button className="text-white/60 text-[16px] font-bold drop-shadow-md hover:text-white transition-colors">استكشف</button>
          <button className="text-white/60 text-[16px] font-bold drop-shadow-md hover:text-white transition-colors">أتابعه</button>
          <div className="relative flex flex-col items-center">
            <button className="text-white text-[17px] font-black drop-shadow-md">لك</button>
            <div className="absolute -bottom-2 w-7 h-1 bg-white rounded-full"></div>
          </div>
        </div>
        <button className="text-white drop-shadow-lg p-1 active:scale-90 transition-transform pointer-events-auto">
          <Tv size={26} strokeWidth={2.5} />
        </button>
      </div>

      {/* حاوية الفيديوهات */}
      <div 
        ref={feedContainerRef}
        className="h-full w-full overflow-y-scroll snap-vertical bg-black relative no-scrollbar"
        style={{ scrollSnapType: 'y mandatory' }}
      >
        {posts.map((post) => (
          <div key={post.id} data-id={post.id} className="snap-item h-screen w-full" style={{ scrollSnapStop: 'always' }}>
            <FeedItem 
              post={post} 
              isActive={activePostId === post.id}
              onSendGift={handleSendGift} 
              onCommentClick={() => setShowComments(true)}
              onProfileClick={(userId) => onProfileNavigate(userId)}
              onDeletePost={onDeletePost}
              onUpdatePrivacy={onUpdatePrivacy}
              onShareToStory={onShareToStory}
            />
          </div>
        ))}
      </div>

      {showComments && (
        <CommentSheet 
          post={currentActivePost}
          onClose={() => setShowComments(false)} 
          onSendGift={handleSendGift} 
        />
      )}

      {activeGift && (
        <div className="fixed inset-0 pointer-events-none z-[300] flex items-center justify-center">
          <div className="animate-gift-float flex flex-col items-center">
            <span className="text-[150px] filter drop-shadow-[0_0_40px_rgba(234,179,8,0.6)]">{activeGift.icon}</span>
            <div className="mt-4 bg-gradient-to-r from-yellow-600 to-yellow-400 px-10 py-3 rounded-full shadow-2xl border border-white/20">
              <span className="text-black font-black text-2xl italic uppercase tracking-wider">هدية ملكية! 👑</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
