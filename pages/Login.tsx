
import React, { useState } from 'react';
import { Smartphone, Facebook, Mail, User, Lock, ChevronRight, Sparkles, UserPlus, LogIn, Gift, ArrowLeft } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginProps {
  onLogin: (userData: any, mode: 'login' | 'signup') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    identifier: '', // للهاتف أو البريد في تسجيل الدخول
    email: '',      // للبريد في إنشاء الحساب
    password: '',
    name: '',
    username: '',
    referralCode: ''
  });

  const handleAction = () => {
    // التحقق من الحقول بناءً على الوضع المختار
    if (mode === 'login') {
      if (!formData.identifier.trim() || !formData.password.trim()) {
        alert('عذراً، يجب إدخال اسم المستخدم وكلمة المرور للمتابعة.');
        return;
      }
    } else {
      if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
        alert('يرجى ملء كافة الحقول (الاسم، اسم المستخدم، البريد، وكلمة المرور) لإنشاء حسابك.');
        return;
      }
      // تحقق إضافي من البريد
      if (!formData.email.includes('@')) {
        alert('يرجى إدخال بريد إلكتروني صحيح.');
        return;
      }
    }

    // تمرير البيانات والوضع الحالي للـ App.tsx لاتخاذ القرار النهائي
    onLogin(formData, mode);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white flex flex-col font-sans relative overflow-y-auto no-scrollbar select-none" dir="rtl">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-yellow-500/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-80 h-80 bg-[#ff2d55]/10 rounded-full blur-[120px]"></div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 z-10 w-full max-w-md mx-auto">
        {/* Logo Section */}
        <div className="mb-6 text-center animate-fade-in shrink-0">
          <div className="w-16 h-16 bg-gradient-to-tr from-yellow-600 to-yellow-400 rounded-[24px] mx-auto flex items-center justify-center shadow-2xl shadow-yellow-500/20 mb-3 transform rotate-3">
            <span className="text-black text-3xl font-black italic">T</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-0.5 bg-gradient-to-l from-yellow-500 to-white bg-clip-text text-transparent">تيك بوك</h1>
          <p className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">عالمك الفاخر للتواصل</p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-white/5 backdrop-blur-2xl rounded-[35px] p-6 border border-white/10 shadow-2xl animate-slide-up shrink-0">
          <div className="flex bg-black/40 p-1 rounded-xl mb-6">
            <button 
              onClick={() => setMode('login')}
              className={`flex-1 py-2.5 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-2 ${mode === 'login' ? 'bg-yellow-500 text-black shadow-lg' : 'text-zinc-500'}`}
            >
              <LogIn size={14} /> تسجيل دخول
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 rounded-lg text-[11px] font-black transition-all flex items-center justify-center gap-2 ${mode === 'signup' ? 'bg-yellow-500 text-black shadow-lg' : 'text-zinc-500'}`}
            >
              <UserPlus size={14} /> حساب جديد
            </button>
          </div>

          <div className="space-y-3">
            {mode === 'signup' && (
              <div className="relative group">
                <div className="absolute inset-y-0 right-4 flex items-center text-zinc-500 group-focus-within:text-yellow-500 transition-colors"><User size={16} /></div>
                <input 
                  type="text" 
                  placeholder="الاسم الكامل"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pr-11 pl-4 text-xs font-bold focus:outline-none focus:border-yellow-500/50 transition-all text-white"
                />
              </div>
            )}

            {mode === 'signup' && (
              <>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-4 flex items-center text-zinc-500 group-focus-within:text-yellow-500 transition-colors"><User size={16} /></div>
                  <input 
                    type="text" 
                    placeholder="اسم المستخدم"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pr-11 pl-4 text-xs font-bold focus:outline-none focus:border-yellow-500/50 transition-all text-white"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 right-4 flex items-center text-zinc-500 group-focus-within:text-yellow-500 transition-colors"><Mail size={16} /></div>
                  <input 
                    type="email" 
                    placeholder="البريد الإلكتروني"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pr-11 pl-4 text-xs font-bold focus:outline-none focus:border-yellow-500/50 transition-all text-white"
                  />
                </div>
              </>
            )}

            {mode === 'login' && (
              <div className="relative group">
                <div className="absolute inset-y-0 right-4 flex items-center text-zinc-500 group-focus-within:text-yellow-500 transition-colors"><Mail size={16} /></div>
                <input 
                  type="text" 
                  placeholder="الهاتف أو البريد أو اسم المستخدم"
                  value={formData.identifier}
                  onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pr-11 pl-4 text-xs font-bold focus:outline-none focus:border-yellow-500/50 transition-all text-white"
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 right-4 flex items-center text-zinc-500 group-focus-within:text-yellow-500 transition-colors"><Lock size={16} /></div>
              <input 
                type="password" 
                placeholder="كلمة المرور"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pr-11 pl-4 text-xs font-bold focus:outline-none focus:border-yellow-500/50 transition-all text-white"
              />
            </div>

            {mode === 'signup' && (
              <div className="relative group">
                <div className="absolute inset-y-0 right-4 flex items-center text-yellow-500/50 group-focus-within:text-yellow-500 transition-colors"><Gift size={16} /></div>
                <input 
                  type="text" 
                  placeholder="كود الإحالة (اختياري)"
                  value={formData.referralCode}
                  onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3.5 pr-11 pl-4 text-xs font-bold focus:outline-none focus:border-yellow-500/50 transition-all italic text-white"
                />
              </div>
            )}

            <button 
              onClick={handleAction}
              className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-black py-4 rounded-xl font-black text-md shadow-xl shadow-yellow-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {mode === 'login' ? 'دخول آمن' : 'إنشاء الحساب الآن'} <Sparkles size={18} />
            </button>
          </div>

          {mode === 'login' && (
            <button className="w-full text-center mt-3 text-[10px] font-bold text-zinc-500 hover:text-white transition-colors">هل نسيت كلمة المرور؟</button>
          )}
        </div>

        {/* Social Logins */}
        <div className="w-full mt-6 space-y-3 animate-fade-in shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/5"></div>
            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">أو المتابعة عبر</span>
            <div className="flex-1 h-px bg-white/5"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all">
              <Facebook size={16} className="text-blue-500" /> <span className="text-[11px] font-bold">فيسبوك</span>
            </button>
            <button className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all">
              <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="google" /> <span className="text-[11px] font-bold">جوجل</span>
            </button>
          </div>
        </div>

        <p className="mt-8 text-center text-zinc-600 text-[9px] leading-relaxed max-w-[250px] font-bold shrink-0">
          بالاستمرار، أنت توافق على <span className="text-zinc-400 underline">شروط الاستخدام</span> و <span className="text-zinc-400 underline">سياسة الخصوصية</span> الملكية الخاصة بتيك بوك.
        </p>
      </div>

      <style>{`
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.25, 1, 0.5, 1); }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Login;
