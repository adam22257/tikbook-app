
import React from 'react';
import { ChevronRight, ShieldAlert, Gift, Star, Bell, Info, Trash2 } from 'lucide-react';
import { SystemNotification } from '../types';

const SystemNotifs: React.FC<{ notifications: SystemNotification[]; onBack: () => void }> = ({ notifications, onBack }) => {
  return (
    <div className="h-screen bg-white text-black font-sans flex flex-col" dir="rtl">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between border-b border-zinc-50 sticky top-0 bg-white z-50 shrink-0">
        <button onClick={onBack} className="p-1 active:scale-90 transition-transform">
          <ChevronRight size={28} className="text-zinc-900" />
        </button>
        <h2 className="text-[17px] font-bold">إشعارات النظام</h2>
        <button className="p-1 text-zinc-400"><Trash2 size={20} /></button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="p-4 space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className="bg-zinc-50/50 border border-zinc-100 rounded-[28px] p-5 flex gap-4 transition-all active:scale-[0.98]">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                notif.type === 'security' ? 'bg-red-100 text-red-600' : 
                notif.type === 'reward' ? 'bg-yellow-100 text-yellow-600' : 
                'bg-blue-100 text-blue-600'
              }`}>
                {notif.type === 'security' ? <ShieldAlert size={22} /> : 
                 notif.type === 'reward' ? <Star size={22} fill="currentColor" /> : 
                 <Bell size={22} />}
              </div>
              <div className="flex-1">
                 <div className="flex justify-between items-start mb-1">
                    <h4 className="text-[14px] font-black text-zinc-900">{notif.title}</h4>
                    <span className="text-[9px] font-bold text-zinc-300">الآن</span>
                 </div>
                 <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">
                    {notif.description}
                 </p>
                 {notif.type === 'reward' && (
                    <button className="mt-3 bg-yellow-500 text-black px-4 py-1.5 rounded-full text-[10px] font-black shadow-sm">مطالبة بالجائزة 🎁</button>
                 )}
              </div>
            </div>
          ))}

          {/* Static Mock Data for visualization */}
          <div className="bg-zinc-50/50 border border-zinc-100 rounded-[28px] p-5 flex gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Info size={22} />
            </div>
            <div className="flex-1">
               <div className="flex justify-between items-start mb-1">
                  <h4 className="text-[14px] font-black text-zinc-900">تحديث أمني</h4>
                  <span className="text-[9px] font-bold text-zinc-300">أمس</span>
               </div>
               <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">
                  تم تعزيز حماية حسابك بنجاح. تيك بوك يضمن لك خصوصية تامة.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemNotifs;
