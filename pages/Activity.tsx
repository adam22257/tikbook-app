
import React, { useState, useEffect } from 'react';
import { ChevronRight, Heart, MessageSquare, AtSign, Video, Settings, UserPlus, Trash2 } from 'lucide-react';
import { ActivityItem } from '../types';

const Activity: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('tikbook_activities');
    const currentUser = JSON.parse(localStorage.getItem('tikbook_user') || '{}');
    if (saved) {
      const allActivities: ActivityItem[] = JSON.parse(saved);
      // تصفية الأنشطة الخاصة بالمستخدم الحالي فقط وترتيبها بالأحدث
      const filtered = allActivities
        .filter(act => act.userId === currentUser.id)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setActivities(filtered);
    }
  }, []);

  const clearActivities = () => {
    if (confirm('هل تريد مسح سجل النشاطات؟')) {
      const currentUser = JSON.parse(localStorage.getItem('tikbook_user') || '{}');
      const saved = JSON.parse(localStorage.getItem('tikbook_activities') || '[]');
      const remaining = saved.filter((act: ActivityItem) => act.userId !== currentUser.id);
      localStorage.setItem('tikbook_activities', JSON.stringify(remaining));
      setActivities([]);
    }
  };

  return (
    <div className="h-screen bg-white text-black font-sans flex flex-col" dir="rtl">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-zinc-50 sticky top-0 bg-white z-50 shrink-0">
        <button onClick={onBack} className="p-1 active:scale-90 transition-transform">
          <ChevronRight size={28} className="text-zinc-900" />
        </button>
        <h2 className="text-[17px] font-bold">النشاط</h2>
        <button onClick={clearActivities} className="p-1 text-zinc-400"><Trash2 size={22} /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activities.length > 0 ? (
          <div className="divide-y divide-zinc-50">
            {activities.map((act) => (
              <div key={act.id} className="flex items-center gap-4 px-4 py-4 active:bg-zinc-50 transition-colors cursor-pointer">
                <div className="relative shrink-0">
                  <img src={act.fromUserAvatar} className="w-12 h-12 rounded-full object-cover border border-zinc-100" />
                  <div className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-white ${
                    act.type === 'like' ? 'bg-red-500' : 
                    act.type === 'comment' ? 'bg-blue-500' : 
                    act.type === 'follow' ? 'bg-orange-500' : 'bg-green-500'
                  }`}>
                    {act.type === 'like' ? <Heart size={8} fill="white" className="text-white" /> : 
                     act.type === 'comment' ? <MessageSquare size={8} fill="white" className="text-white" /> : 
                     act.type === 'follow' ? <UserPlus size={8} className="text-white" /> :
                     <AtSign size={8} className="text-white" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-[13px] text-zinc-900 leading-tight">
                    <span className="font-black">{act.fromUserName}</span>{' '}
                    {act.type === 'like' ? 'أعجب بمنشورك.' : 
                     act.type === 'comment' ? `علق على منشورك: ${act.text}` : 
                     act.type === 'follow' ? 'بدأ في متابعتك.' :
                     'ذكرك في منشور.'}
                  </p>
                  <span className="text-[10px] text-zinc-400 font-bold">
                    {new Date(act.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {act.postThumb && (
                  <div className="w-12 h-16 rounded-lg bg-zinc-100 overflow-hidden shrink-0 border border-zinc-50">
                    <img src={act.postThumb} className="w-full h-full object-cover opacity-80" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center text-zinc-400">
             <div className="bg-zinc-50 p-6 rounded-full mb-4">
                <AtSign size={40} className="opacity-20" />
             </div>
             <p className="font-bold text-sm italic">لا يوجد نشاط مسجل حالياً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
