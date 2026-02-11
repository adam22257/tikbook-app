
import React from 'react';
import { Search, UserPlus, Heart, Users, Archive, Plus, ChevronDown } from 'lucide-react';
import { SystemNotification, User, AppRoute, Story } from '../types';

interface ChatListProps {
  notifications: SystemNotification[];
  currentUser: User;
  stories: Story[];
  onChatSelect: (id: string) => void;
  onStorySelect: (story: Story) => void;
  onNavigate: (route: AppRoute) => void;
}

const ChatList: React.FC<ChatListProps> = ({ notifications, currentUser, stories, onChatSelect, onStorySelect, onNavigate }) => {
  return (
    <div className="h-screen overflow-y-auto bg-white text-black font-sans pb-28 no-scrollbar" dir="rtl">
      <div className="flex justify-between items-center px-4 py-3 bg-white sticky top-0 z-50 border-b border-zinc-50">
        <button className="p-1"><Search size={26} className="text-zinc-800" /></button>
        <div className="flex items-center gap-1 cursor-pointer">
           <div className="w-2 h-2 bg-green-500 rounded-full mt-0.5"></div>
           <h1 className="text-[17px] font-bold">صندوق الوارد</h1>
           <ChevronDown size={16} className="text-zinc-400" />
        </div>
        <button className="p-1"><UserPlus size={26} className="text-zinc-800" /></button>
      </div>

      <div className="px-4 py-4 flex gap-4 overflow-x-auto no-scrollbar border-b border-zinc-50">
        <div className="flex flex-col items-center gap-1.5 shrink-0 relative">
          <div className="w-[68px] h-[68px] rounded-full p-0.5 border-2 border-zinc-100 bg-white relative">
            <img src={currentUser.avatar} className="w-full h-full rounded-full object-cover" />
            <button 
              onClick={() => onNavigate(AppRoute.STORY_UPLOAD)}
              className="absolute bottom-0 right-0 bg-[#00b2ff] rounded-full p-1 border-2 border-white shadow-sm active:scale-90 transition-transform"
            >
              <Plus size={14} className="text-white" strokeWidth={3} />
            </button>
          </div>
          <span className="text-[11px] font-medium text-zinc-500">إنشاء</span>
        </div>
        
        {stories.map(story => (
          <div key={story.id} onClick={() => onStorySelect(story)} className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer">
            <div className="w-[68px] h-[68px] rounded-full p-0.5 border-2 border-[#ff2d55]">
              <img src={story.userAvatar} className="w-full h-full rounded-full object-cover" />
            </div>
            <span className="text-[11px] font-medium text-zinc-700 truncate w-16 text-center">{story.userName}</span>
          </div>
        ))}
      </div>

      <div className="mt-2">
        <div onClick={() => onNavigate(AppRoute.FOLLOWERS)} className="flex items-center gap-4 px-4 py-3 active:bg-zinc-50 transition-colors cursor-pointer">
          <div className="w-12 h-12 rounded-full bg-[#00b2ff] flex items-center justify-center text-white"><Users size={24} fill="white" /></div>
          <div className="flex-1"><h3 className="text-[15px] font-bold">متابعون جدد</h3><p className="text-[12px] text-zinc-400">لا توجد طلبات متابعة حالياً.</p></div>
        </div>
        <div onClick={() => onNavigate(AppRoute.ACTIVITY)} className="flex items-center gap-4 px-4 py-3 active:bg-zinc-50 transition-colors cursor-pointer">
          <div className="relative"><div className="w-12 h-12 rounded-full bg-[#ff2d55] flex items-center justify-center text-white"><Heart size={24} fill="white" /></div><span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">1</span></div>
          <div className="flex-1"><h3 className="text-[15px] font-bold">النشاط</h3><p className="text-[12px] text-zinc-800 font-medium">أحمد مشعل أعجب بمنشورك.</p></div>
        </div>
        <div onClick={() => onNavigate(AppRoute.SYSTEM_NOTIFS)} className="flex items-center gap-4 px-4 py-3 active:bg-zinc-50 transition-colors cursor-pointer">
          <div className="relative"><div className="w-12 h-12 rounded-full bg-[#0d1b3e] flex items-center justify-center text-white"><Archive size={22} fill="white" /></div>{notifications.length > 0 && <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>}</div>
          <div className="flex-1"><h3 className="text-[15px] font-bold">إشعارات النظام</h3><p className="text-[12px] text-zinc-400">لديك {notifications.length} إشعارات جديدة.</p></div>
        </div>
      </div>

      <div className="mt-4 border-t border-zinc-50">
         <h4 className="px-4 py-3 text-xs font-bold text-zinc-400">الرسائل</h4>
         <div onClick={() => onChatSelect('dummy')} className="flex items-center gap-4 px-4 py-3 active:bg-zinc-50 cursor-pointer">
            <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-white font-black border-2 border-yellow-500">T</div>
            <div className="flex-1">
               <div className="flex justify-between items-center"><h3 className="text-[15px] font-black">فريق دعم تيك بوك 🛡️</h3><span className="text-[10px] text-zinc-400">الآن</span></div>
               <p className="text-[12px] text-[#ff2d55] font-bold">مرحبا بك! راسلنا لأي استفسار.</p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default ChatList;
