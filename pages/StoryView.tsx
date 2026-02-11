
import React from 'react';
import { X, Heart, Gift as GiftIcon, Send, Music } from 'lucide-react';
import { Story } from '../types';

const StoryView: React.FC<{ story: Story | null; onBack: () => void }> = ({ story, onBack }) => {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-[250] bg-black text-white flex flex-col font-sans" dir="rtl">
      <div className="absolute top-0 left-0 right-0 p-4 pt-10 flex items-center justify-between z-50 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <img src={story.userAvatar} className="w-10 h-10 rounded-full border-2 border-[#ff2d55]" />
          <div>
            <h3 className="text-sm font-bold">{story.userName}</h3>
            <p className="text-[10px] text-white/60">منذ قليل</p>
          </div>
        </div>
        <button onClick={onBack} className="p-1"><X size={28} /></button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-zinc-900 overflow-hidden relative">
         {story.type === 'image' ? (
           <img src={story.content} className="w-full h-full object-contain" />
         ) : (
           <h2 className="text-3xl font-black drop-shadow-2xl">{story.content}</h2>
         )}
         
         {story.musicTitle && (
            <div className="absolute bottom-32 bg-black/40 px-4 py-1.5 rounded-full flex items-center gap-2 text-[10px] font-bold border border-white/10">
               <Music size={12} className="text-yellow-500 animate-spin" />
               <span>{story.musicTitle}</span>
            </div>
         )}
      </div>

      <div className="p-4 pb-12 flex items-center gap-3 bg-gradient-to-t from-black to-transparent">
        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-full flex items-center px-4 py-2 border border-white/10">
           <input 
             placeholder="رد على القصة..." 
             className="flex-1 bg-transparent border-none text-sm focus:ring-0 py-2"
           />
           <button className="text-[#ff2d55]"><Send size={20} /></button>
        </div>
        <button className="flex flex-col items-center"><Heart size={26} /><span className="text-[8px] font-bold mt-1">0</span></button>
        <button className="flex flex-col items-center text-yellow-500"><GiftIcon size={26} /><span className="text-[8px] font-bold mt-1">هدايا</span></button>
      </div>
    </div>
  );
};

export default StoryView;
