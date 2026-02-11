
import React, { useState, useRef } from 'react';
import { ChevronRight, Music, X, Upload as UploadIcon, Loader2 } from 'lucide-react';
import { User, Story } from '../types';

interface StoryUploadProps {
  currentUser: User;
  onBack: () => void;
  onUpload: (story: Story) => void;
}

const StoryUpload: React.FC<StoryUploadProps> = ({ currentUser, onBack, onUpload }) => {
  const [content, setContent] = useState('');
  const [bgType, setBgType] = useState<'color' | 'image'>('color');
  const [bgColor, setBgColor] = useState('bg-gradient-to-tr from-purple-500 to-pink-500');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [musicFile, setMusicFile] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const musicInputRef = useRef<HTMLInputElement>(null);

  const handlePublish = () => {
    if (!content && !imagePreview) return;
    setIsPublishing(true);
    
    const newStory: Story = {
      id: `s-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: imagePreview || content,
      type: imagePreview ? 'image' : 'text',
      musicTitle: musicFile || 'بدون موسيقى',
      timestamp: new Date().toISOString()
    };

    setTimeout(() => {
      onUpload(newStory);
      setIsPublishing(false);
    }, 1000);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreview(ev.target?.result as string);
        setBgType('image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMusic = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setMusicFile(file.name);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white flex flex-col font-sans" dir="rtl">
      <div className="p-4 flex items-center justify-between border-b border-white/5 bg-black/50 backdrop-blur-md">
        <button onClick={onBack} className="p-1"><ChevronRight size={28} /></button>
        <h2 className="text-lg font-black tracking-tight">قصة جديدة</h2>
        <button 
          onClick={handlePublish} 
          disabled={(!content && !imagePreview) || isPublishing}
          className={`font-black text-sm px-4 py-1.5 rounded-full ${(!content && !imagePreview) ? 'text-zinc-600' : 'bg-[#ff2d55] text-white shadow-lg'}`}
        >
          {isPublishing ? <Loader2 size={16} className="animate-spin" /> : 'نشر'}
        </button>
      </div>

      <div className={`flex-1 flex flex-col items-center justify-center p-6 relative transition-all duration-500 ${bgType === 'color' ? bgColor : 'bg-zinc-900'}`}>
        {bgType === 'image' && imagePreview && (
          <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" />
        )}
        
        <textarea 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="اكتب شيئاً مميزاً..."
          className="w-full bg-transparent border-none text-center text-3xl font-black placeholder-white/20 focus:ring-0 z-10 drop-shadow-2xl"
        />

        {musicFile && (
          <div className="absolute top-20 bg-white/10 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 flex items-center gap-2 animate-bounce-slow">
            <Music size={14} className="text-yellow-500" />
            <span className="text-[10px] font-bold truncate max-w-[150px]">{musicFile}</span>
            <button onClick={() => setMusicFile(null)}><X size={12} /></button>
          </div>
        )}

        <div className="absolute bottom-10 left-0 right-0 px-6 flex flex-col gap-4 z-20">
          <div className="flex gap-4">
             <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-black/40 backdrop-blur-md py-4 rounded-2xl flex flex-col items-center gap-2 border border-white/10 active:scale-95 transition-transform">
                <UploadIcon size={24} className="text-[#00b2ff]" /> <span className="text-[10px] font-bold">صورة من المعرض</span>
             </button>
             <button onClick={() => musicInputRef.current?.click()} className="flex-1 bg-black/40 backdrop-blur-md py-4 rounded-2xl flex flex-col items-center gap-2 border border-white/10 active:scale-95 transition-transform">
                <Music size={24} className="text-yellow-500" /> <span className="text-[10px] font-bold">موسيقى من الجهاز</span>
             </button>
          </div>
          <div className="flex gap-2 justify-center">
             {['bg-gradient-to-tr from-purple-500 to-pink-500', 'bg-gradient-to-tr from-blue-500 to-cyan-500', 'bg-gradient-to-tr from-orange-500 to-red-500', 'bg-black border border-white/20'].map(c => (
               <button key={c} onClick={() => { setBgColor(c); setBgType('color'); setImagePreview(null); }} className={`w-8 h-8 rounded-full border-2 border-white ${c}`}></button>
             ))}
          </div>
        </div>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleImage} className="hidden" accept="image/*" />
      <input type="file" ref={musicInputRef} onChange={handleMusic} className="hidden" accept="audio/*" />
    </div>
  );
};

export default StoryUpload;
