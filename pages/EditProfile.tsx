
import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Camera, Copy, Check, ChevronLeft, X } from 'lucide-react';
import { User as UserType } from '../types';

interface EditProfileProps {
  onBack: () => void;
  currentUser: UserType;
  onUpdateUser: (id: string, updates: Partial<UserType>) => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ onBack, currentUser, onUpdateUser }) => {
  const [user, setUser] = useState<UserType>(currentUser);
  const [copied, setCopied] = useState(false);
  const [editingField, setEditingField] = useState<'none' | 'name' | 'username' | 'bio'>('none');
  const [tempValue, setTempValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تحديث حالة المستخدم المحلية إذا تغير من الخارج
  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  const profileLink = `tikbook.com/@${user.username}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startEditing = (field: 'name' | 'username' | 'bio', current: string) => {
    const now = new Date();

    if (field === 'name') {
      const lastChange = user.lastNameChangeDate ? new Date(user.lastNameChangeDate) : new Date(0);
      const diffDays = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 7 && user.lastNameChangeDate) {
        alert(`لا يمكنك تغيير الاسم إلا مرة كل 7 أيام. متبقي ${7 - diffDays} يوم.`);
        return;
      }
    }

    if (field === 'username') {
      const lastChange = user.lastUsernameChangeDate ? new Date(user.lastUsernameChangeDate) : new Date(0);
      const diffDays = Math.floor((now.getTime() - lastChange.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30 && user.lastUsernameChangeDate) {
        alert(`لا يمكنك تغيير اسم المستخدم إلا مرة كل 30 يوماً. متبقي ${30 - diffDays} يوم.`);
        return;
      }
    }

    setEditingField(field);
    setTempValue(current);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onUpdateUser(user.id, { avatar: url });
    }
  };

  const saveEdit = () => {
    if (!tempValue.trim() && editingField !== 'bio') return;

    const updates: Partial<UserType> = {};
    const now = new Date().toISOString();

    if (editingField === 'name') {
      updates.name = tempValue;
      updates.lastNameChangeDate = now;
    } else if (editingField === 'username') {
      // التحقق من الصيغة (أحرف وأرقام فقط)
      if (!/^[a-zA-Z0-9._]+$/.test(tempValue)) {
        alert('اسم المستخدم يجب أن يحتوي على أحرف وأرقام ونقاط فقط.');
        return;
      }
      updates.username = tempValue;
      updates.lastUsernameChangeDate = now;
    } else if (editingField === 'bio') {
      updates.bio = tempValue;
    }

    onUpdateUser(user.id, updates);
    setEditingField('none');
    alert('تم حفظ التعديلات بنجاح ✨');
  };

  if (editingField !== 'none') {
    return (
      <div className="h-screen bg-white text-black font-sans flex flex-col animate-fade-in" dir="rtl">
        <div className="px-4 py-4 flex items-center justify-between border-b border-zinc-100 sticky top-0 bg-white z-50">
          <button onClick={() => setEditingField('none')} className="p-1"><X size={24} /></button>
          <h2 className="text-[17px] font-bold">
            {editingField === 'name' ? 'الاسم' : editingField === 'username' ? 'اسم المستخدم' : 'السيرة الذاتية'}
          </h2>
          <button 
            onClick={saveEdit} 
            className={`text-[15px] font-bold ${tempValue.trim() || editingField === 'bio' ? 'text-[#ff2d55]' : 'text-zinc-300'}`}
          >
            حفظ
          </button>
        </div>
        <div className="p-6">
          <div className="relative">
            {editingField === 'bio' ? (
              <textarea 
                autoFocus
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full bg-zinc-50 border-none rounded-xl py-4 px-4 text-[15px] focus:ring-1 focus:ring-[#ff2d55] h-32"
                placeholder="اكتب شيئاً عن نفسك..."
                maxLength={150}
              />
            ) : (
              <input 
                autoFocus
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full bg-zinc-50 border-none rounded-xl py-4 px-4 text-[15px] focus:ring-1 focus:ring-[#ff2d55]"
                placeholder={editingField === 'name' ? 'أدخل اسمك' : 'أدخل اسم المستخدم'}
                maxLength={editingField === 'name' ? 30 : 20}
              />
            )}
            <button 
              onClick={() => setTempValue('')}
              className="absolute left-3 top-4 bg-zinc-200 rounded-full p-1 text-zinc-500"
            >
              <X size={14} />
            </button>
          </div>
          <p className="mt-4 text-[12px] text-zinc-400 leading-relaxed text-right">
            {editingField === 'name' 
              ? 'يمكن تغيير اسمك مرة واحدة كل 7 أيام.' 
              : editingField === 'username' 
              ? 'يمكن تغيير اسم المستخدم مرة واحدة كل 30 يوماً. يمكن أن يحتوي فقط على أحرف وأرقام وشرطات سفلية ونقاط.'
              : 'أخبر الآخرين المزيد عنك بكلمات قليلة (بحد أقصى 150 حرفاً).'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#f8f9fa] text-black font-sans flex flex-col overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between bg-white border-b border-zinc-100 sticky top-0 z-50 shrink-0">
        <button onClick={onBack} className="p-1 active:scale-90 transition-transform">
          <ChevronRight size={28} className="text-zinc-900" />
        </button>
        <h2 className="text-[18px] font-bold">تعديل الملف الشخصي</h2>
        <div className="w-10"></div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center py-8">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative w-28 h-28 cursor-pointer active:scale-95 transition-transform"
          >
            <img 
              src={user.avatar} 
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-sm" 
              alt="avatar" 
            />
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center">
              <Camera size={32} className="text-white" />
            </div>
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 text-[#00b2ff] text-sm font-bold"
          >
            تغيير الصورة
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
            accept="image/*" 
          />
        </div>

        {/* Info Rows Group 1 */}
        <div className="mx-4 bg-white rounded-2xl shadow-sm border border-zinc-50 overflow-hidden">
          {/* Name Row */}
          <div 
            onClick={() => startEditing('name', user.name)}
            className="flex items-center justify-between px-4 py-5 border-b border-zinc-50 active:bg-zinc-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ChevronLeft size={18} className="text-zinc-300" />
            </div>
            <span className="text-[15px] font-bold text-zinc-800 flex-1 text-center truncate px-4">{user.name}</span>
            <span className="text-[14px] text-zinc-500 min-w-[60px] text-left">الاسم</span>
          </div>

          {/* Username Row */}
          <div 
            onClick={() => startEditing('username', user.username)}
            className="flex items-center justify-between px-4 py-5 border-b border-zinc-50 active:bg-zinc-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ChevronLeft size={18} className="text-zinc-300" />
            </div>
            <span className="text-[15px] font-bold text-zinc-800 flex-1 text-center truncate px-4">{user.username}</span>
            <span className="text-[14px] text-zinc-500 min-w-[100px] text-left">اسم المستخدم</span>
          </div>

          {/* Link Row */}
          <div className="flex items-center justify-between px-4 py-5 active:bg-zinc-50 transition-colors">
            <button 
              onClick={handleCopyLink}
              className={`p-1.5 rounded-lg transition-colors ${copied ? 'text-green-500' : 'text-zinc-400'}`}
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
            <span className="text-[15px] font-bold text-zinc-800 flex-1 text-center truncate px-4" dir="ltr">
              {profileLink}
            </span>
          </div>
        </div>

        {/* Section Label */}
        <div className="px-6 pt-6 pb-2 text-right">
          <span className="text-[13px] text-zinc-400 font-bold">معلومات أساسية</span>
        </div>

        {/* Info Rows Group 2 */}
        <div className="mx-4 bg-white rounded-2xl shadow-sm border border-zinc-50 overflow-hidden">
          {/* Bio Row */}
          <div 
            onClick={() => startEditing('bio', user.bio)}
            className="flex items-center justify-between px-4 py-5 border-b border-zinc-50 active:bg-zinc-50 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <ChevronLeft size={18} className="text-zinc-300" />
            </div>
            <span className="text-[14px] font-bold text-zinc-800 flex-1 text-center line-clamp-2 px-4 leading-relaxed">
              {user.bio || 'أضف سيرة ذاتية'}
            </span>
            <span className="text-[14px] text-zinc-500 min-w-[100px] text-left">السيرة الذاتية</span>
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};

export default EditProfile;
