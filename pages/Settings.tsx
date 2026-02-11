
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Video, Hourglass, Home, User, Lock, Shield, BarChart3, 
  Share2, Bell, Radio, Activity, Users, Megaphone, Play, Moon, 
  Languages, Accessibility, CloudDownload, Trash2, Droplets, Grid, 
  Headphones, Info, LogOut, RefreshCcw, ArrowRight, Check, ShieldCheck,
  EyeOff, MessageSquare, Globe, Smartphone, Key, History, Download, Coins, UserPlus, QrCode, Copy, Save, ShieldAlert, CheckCircle2, Loader2
} from 'lucide-react';
import { AppRoute, User as UserType } from '../types';
import { MOCK_USER } from '../constants';

interface SettingsProps {
  onBack: () => void;
  onLogout: () => void;
  onNavigate: (route: AppRoute) => void;
  onUpdateUser?: (id: string, updates: Partial<UserType>) => void;
}

const Settings: React.FC<SettingsProps> = ({ onBack, onLogout, onNavigate, onUpdateUser }) => {
  const [activeSubPage, setActiveSubPage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserType>(() => JSON.parse(localStorage.getItem('tikbook_user') || JSON.stringify(MOCK_USER)));
  
  // Verification states
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<Partial<UserType> | null>(null);

  const [accountForm, setAccountForm] = useState({
    phone: currentUser.email?.includes('01') ? currentUser.email : '+20 100 000 0000',
    email: currentUser.email || 'user@tikbook.com'
  });

  const [toggles, setToggles] = useState<Record<string, any>>({
    private_account: false,
    save_data: true,
    notifications: true,
    dark_mode: false,
    messaging: 'everyone' 
  });

  const toggleHandler = (id: string) => {
    setToggles(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSaveAccount = () => {
    // التحقق إذا كان هناك تغيير فعلي
    if (accountForm.email !== currentUser.email) {
      setPendingUpdate({ email: accountForm.email });
      setShowVerificationModal(true);
      // محاكاة إرسال كود
      alert(`تم إرسال كود التحقق إلى البريد: ${accountForm.email}`);
    } else {
       alert("لم يتم تغيير أي بيانات للمطالبة بالتحقق");
    }
  };

  const confirmVerification = () => {
    if (!verificationCode) {
      alert("يرجى إدخال الكود المستلم");
      return;
    }
    setIsVerifying(true);
    // محاكاة تأكيد الكود
    setTimeout(() => {
       if (onUpdateUser && pendingUpdate) {
          onUpdateUser(currentUser.id, pendingUpdate);
          setCurrentUser(prev => ({ ...prev, ...pendingUpdate }));
       }
       setIsVerifying(false);
       setShowVerificationModal(false);
       setVerificationCode('');
       setPendingUpdate(null);
       alert("تم تحديث معلومات الحساب بنجاح بعد التحقق ✨");
    }, 1500);
  };

  const sections: any[] = [
    {
      items: [
        { id: 'store', icon: <Coins className="text-yellow-500" size={20} />, title: 'شراء العملات', action: () => onNavigate(AppRoute.STORE) },
        { id: 'referral', icon: <UserPlus className="text-cyan-500" size={20} />, title: 'إحالة الأصدقاء', action: () => onNavigate(AppRoute.REFERRAL) },
        { id: 'verification', icon: <ShieldCheck className="text-blue-500" size={20} />, title: 'طلب توثيق الحساب', action: () => onNavigate(AppRoute.VERIFICATION) },
      ]
    },
    {
      title: 'الحساب',
      items: [
        { id: 'account', icon: <User className="text-zinc-500" size={20} />, title: 'الحساب' },
        { id: 'privacy', icon: <Lock className="text-zinc-500" size={20} />, title: 'الخصوصية' },
        { id: 'security', icon: <Shield className="text-zinc-500" size={20} />, title: 'الأمان والأذونات' },
        { id: 'share_profile', icon: <Share2 className="text-zinc-500" size={20} />, title: 'مشاركة الملف الشخصي' },
      ]
    },
    {
      title: 'المحتوى والعرض',
      items: [
        { id: 'notifications', icon: <Bell className="text-zinc-500" size={20} />, title: 'الإشعارات' },
        { id: 'display', icon: <Moon className="text-zinc-500" size={20} />, title: 'العرض' },
        { id: 'language', icon: <Languages className="text-zinc-500" size={20} />, title: 'اللغة' },
      ]
    },
    {
      title: 'ذاكرة التخزين المؤقت والبيانات',
      items: [
        { id: 'clear_space', icon: <Trash2 className="text-zinc-500" size={20} />, title: 'تحرير المساحة' },
        { id: 'data_saver', icon: <Droplets className="text-zinc-500" size={20} />, title: 'توفير البيانات' },
      ]
    },
    {
      title: 'تسجيل الدخول',
      items: [
        { id: 'logout', icon: <LogOut className="text-red-500" size={20} />, title: 'تسجيل الخروج', action: onLogout },
      ]
    }
  ];

  const CustomSwitch = ({ active, onToggle }: { active: boolean, onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-green-500 shadow-inner' : 'bg-zinc-200'}`}
    >
      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all ${active ? 'right-7' : 'right-1'}`}></div>
    </button>
  );

  const renderSubPage = () => {
    switch (activeSubPage) {
      case 'account':
        return (
          <div className="animate-fade-in bg-white h-full pb-24" dir="rtl">
            <div className="p-6 text-center border-b border-zinc-50">
               <div className="w-20 h-20 bg-zinc-100 rounded-full mx-auto mb-4 flex items-center justify-center relative">
                  <img src={currentUser.avatar} className="w-full h-full rounded-full object-cover" />
               </div>
               <h3 className="font-bold">معلومات الحساب</h3>
               <p className="text-xs text-zinc-400 mt-1">تأكد من تحديث بياناتك دورياً</p>
            </div>
            
            <div className="mt-4 space-y-1">
               <div className="px-6 py-4 flex flex-col gap-1 border-b border-zinc-50">
                  <label className="text-[10px] font-black text-zinc-400 uppercase">رقم الهاتف</label>
                  <input 
                    type="text" 
                    value={accountForm.phone}
                    onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})}
                    className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                  />
               </div>
               <div className="px-6 py-4 flex flex-col gap-1 border-b border-zinc-50">
                  <label className="text-[10px] font-black text-zinc-400 uppercase">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    value={accountForm.email}
                    onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
                    className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                  />
               </div>
            </div>

            <div className="mt-8 px-6">
              <button 
                onClick={handleSaveAccount}
                className="w-full py-4 bg-[#ff2d55] text-white rounded-2xl font-black text-sm shadow-xl shadow-red-500/10 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Save size={18} /> حفظ التغييرات
              </button>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="animate-fade-in bg-white h-full pb-20" dir="rtl">
            <h3 className="px-6 py-4 text-zinc-400 text-[10px] font-black uppercase tracking-widest">اكتشاف الحساب</h3>
            <div className="bg-white border-y border-zinc-100">
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-50">
                <div className="text-right">
                  <p className="text-sm font-bold">حساب خاص</p>
                  <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">عندما يكون حسابك خاصاً، يمكن فقط للمتابعين الذين وافقت عليهم مشاهدة محتواك.</p>
                </div>
                <CustomSwitch active={toggles.private_account} onToggle={() => toggleHandler('private_account')} />
              </div>
            </div>

            <h3 className="px-6 py-4 text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-4">التفاعلات والرسائل</h3>
            <div className="bg-white border-y border-zinc-100">
               <div className="px-6 py-4 border-b border-zinc-50">
                  <p className="text-sm font-bold mb-3">من يمكنه إرسال رسائل خاصة؟</p>
                  <div className="flex gap-2">
                     {['everyone', 'friends', 'no-one'].map(mode => (
                       <button 
                         key={mode}
                         onClick={() => setToggles({...toggles, messaging: mode})}
                         className={`flex-1 py-2 rounded-xl text-[10px] font-black border transition-all ${toggles.messaging === mode ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white text-zinc-400 border-zinc-100'}`}
                       >
                         {mode === 'everyone' ? 'الجميع' : mode === 'friends' ? 'الأصدقاء' : 'لا أحد'}
                       </button>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="animate-fade-in bg-white h-full pb-20" dir="rtl">
            <div className="p-8 bg-green-50/50 flex flex-col items-center border-b border-green-100">
               <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-green-500/20">
                  <ShieldCheck size={32} />
               </div>
               <h3 className="font-bold text-green-800">حسابك آمن</h3>
            </div>
          </div>
        );

      case 'share_profile':
        return (
          <div className="animate-fade-in bg-zinc-50 h-full p-8 flex flex-col items-center" dir="rtl">
             <div className="bg-white p-8 rounded-[40px] shadow-2xl border border-zinc-100 w-full flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full border-4 border-zinc-100 p-1 mb-4">
                   <img src={currentUser.avatar} className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="font-black text-lg">@{currentUser.username}</h3>
                <div className="mt-8 p-4 bg-zinc-50 rounded-3xl border border-zinc-100">
                   <QrCode size={180} className="text-zinc-900" />
                </div>
                <p className="text-[10px] text-zinc-400 font-bold mt-6 uppercase tracking-widest">امسح الكود لمتابعتي على تيك بوك</p>
             </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center animate-fade-in bg-white min-h-[400px]">
            <div className="w-24 h-24 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
              <Activity size={40} className="text-zinc-200" />
            </div>
            <h3 className="text-lg font-bold mb-2">هذا القسم قيد التجهيز</h3>
            <button 
              onClick={() => setActiveSubPage(null)}
              className="mt-8 bg-yellow-500 text-black px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-yellow-500/20 active:scale-95"
            >
              العودة للإعدادات
            </button>
          </div>
        );
    }
  };

  return (
    <div className="h-screen bg-[#F8F8F8] text-black font-sans flex flex-col overflow-hidden" dir="rtl">
      <div className="p-4 flex items-center justify-between bg-white border-b border-zinc-100 sticky top-0 z-50 shrink-0">
        <button 
          onClick={activeSubPage ? () => setActiveSubPage(null) : onBack} 
          className="p-2 hover:bg-zinc-50 rounded-full transition-colors"
        >
          <ArrowRight size={24} />
        </button>
        <h2 className="text-lg font-black tracking-tight">
          {activeSubPage ? (sections.flatMap(s => s.items) as any[]).find((i: any) => i.id === activeSubPage)?.title : 'الإعدادات والخصوصية'}
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar touch-pan-y">
        <div className="pb-24">
          {activeSubPage ? renderSubPage() : (
            <div className="animate-fade-in">
              {sections.map((section, idx) => (
                <div key={idx} className="mt-4">
                  {section.title && (
                    <h3 className="px-6 py-2 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">{section.title}</h3>
                  )}
                  <div className="bg-white border-y border-zinc-100">
                    {section.items.map((item: any) => (
                      <button 
                        key={item.id} 
                        onClick={item.action ? item.action : () => setActiveSubPage(item.id)}
                        className="w-full flex items-center justify-between px-6 py-4 border-b border-zinc-50 last:border-none active:bg-zinc-50 transition-colors group text-right"
                      >
                        <div className="flex items-center gap-4">
                          <span className="group-active:scale-110 transition-transform opacity-70 shrink-0">{item.icon}</span>
                          <span className={`text-sm font-medium ${item.id === 'logout' ? 'text-red-500' : 'text-zinc-800'}`}>{item.title}</span>
                        </div>
                        <ChevronLeft size={18} className="text-zinc-200 rotate-180" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
           <div className="bg-white w-full max-w-sm rounded-[35px] p-8 shadow-2xl flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
                 <ShieldAlert size={32} />
              </div>
              <h3 className="text-lg font-black text-zinc-900 mb-2">التحقق من الهوية</h3>
              <p className="text-xs text-zinc-500 text-center mb-8 leading-relaxed">
                 لحماية حسابك، يرجى إدخال رمز التحقق الذي تم إرساله إلى وسيلة الاتصال الجديدة.
              </p>
              
              <input 
                 autoFocus
                 type="text" 
                 maxLength={6}
                 value={verificationCode}
                 onChange={(e) => setVerificationCode(e.target.value)}
                 placeholder="0 0 0 0 0 0"
                 className="w-full text-center text-2xl font-black tracking-[0.5em] bg-zinc-50 border-none rounded-2xl py-4 focus:ring-2 focus:ring-blue-500 mb-6"
              />

              <div className="flex gap-3 w-full">
                 <button 
                    onClick={confirmVerification}
                    disabled={isVerifying}
                    className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl font-black text-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                 >
                    {isVerifying ? <Loader2 size={18} className="animate-spin" /> : <><CheckCircle2 size={18} /> تأكيد</>}
                 </button>
                 <button 
                    onClick={() => setShowVerificationModal(false)}
                    className="flex-1 bg-zinc-100 text-zinc-500 py-4 rounded-2xl font-black text-sm active:scale-95"
                 >
                    إلغاء
                 </button>
              </div>
           </div>
        </div>
      )}

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Settings;
