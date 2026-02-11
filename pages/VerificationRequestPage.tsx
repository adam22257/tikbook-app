
import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ShieldCheck, Camera, Send, Info, CheckCircle, Clock, Image as ImageIcon, CreditCard, UserCheck, AlertCircle, Sparkles, Shield, Loader2, Search, Lock, CloudUpload } from 'lucide-react';
import { User, VerificationRequest } from '../types';

interface VerificationProps {
  user: User;
  onBack: () => void;
  onSubmit: (request: Omit<VerificationRequest, 'id' | 'timestamp' | 'status'>) => void;
}

const VerificationRequestPage: React.FC<VerificationProps> = ({ user, onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    category: 'مبدع محتوى',
    reason: '',
  });

  const [images, setImages] = useState({
    idFront: null as string | null,
    idBack: null as string | null,
    selfie: null as string | null,
  });

  const [submissionState, setSubmissionState] = useState<'idle' | 'processing' | 'success'>('idle');
  const [processStep, setProcessStep] = useState(0);

  const fileRefs = {
    front: useRef<HTMLInputElement>(null),
    back: useRef<HTMLInputElement>(null),
    selfie: useRef<HTMLInputElement>(null),
  };

  const categories = ['مبدع محتوى', 'شخصية عامة', 'موسيقي/فنان', 'لاعب محترف', 'أعمال/علامة تجارية'];

  const steps = [
    { label: 'فحص جودة المستندات...', icon: <Search size={16} /> },
    { label: 'تشفير البيانات الحساسة...', icon: <Lock size={16} /> },
    { label: 'رفع الطلب إلى السيرفر الآمن...', icon: <CloudUpload size={16} /> }
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof images) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImages(prev => ({ ...prev, [key]: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (user.verificationStatus === 'pending') return;
    if (!images.idFront || !images.idBack || !images.selfie) {
      alert('يرجى تحميل كافة المستندات المطلوبة (صورة الهوية وجهاً وظهراً وصورة السيلفي).');
      return;
    }
    if (!formData.reason.trim()) {
      alert('يرجى كتابة نبذة عن نشاطك.');
      return;
    }

    setSubmissionState('processing');
    
    // محاكاة مراحل المعالجة بشكل أنيق
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setProcessStep(currentStep);
      } else {
        clearInterval(interval);
        // إتمام الإرسال الفعلي
        onSubmit({
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar,
          category: formData.category,
          reason: formData.reason,
          idFront: images.idFront || undefined,
          idBack: images.idBack || undefined,
          selfieWithId: images.selfie || undefined,
        });
        setSubmissionState('success');
      }
    }, 1200);
  };

  // واجهة النجاح الملكية (الشيك والراقية)
  if (submissionState === 'success') {
    return (
      <div className="h-screen bg-[#050505] text-white p-8 flex flex-col items-center justify-center text-center animate-fade-in relative overflow-hidden">
        {/* تأثيرات خلفية راقية */}
        <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-green-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-yellow-500/5 rounded-full blur-[100px]"></div>

        <div className="relative z-10 space-y-8 max-w-xs">
          <div className="w-28 h-28 bg-gradient-to-tr from-green-600 to-green-400 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-scale-up">
             <CheckCircle size={60} className="text-white drop-shadow-lg" />
          </div>
          
          <div className="space-y-4">
             <h1 className="text-3xl font-black tracking-tight">استلمنا طلبك بنجاح</h1>
             <p className="text-zinc-400 text-sm font-bold leading-relaxed">
               شكراً لك {user.name}، طلبك الآن قيد المراجعة الفنية من قبل فريقنا. سنقوم بإبلاغك بالقرار فور الانتهاء عبر الإشعارات.
             </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-4 rounded-3xl flex items-center gap-4">
             <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Shield size={20} className="text-yellow-500" />
             </div>
             <div className="text-right">
                <p className="text-[10px] text-zinc-500 font-black uppercase">حالة الحساب</p>
                <p className="text-[11px] font-bold text-yellow-500">تحت المراجعة الملكية</p>
             </div>
          </div>

          <button 
            onClick={onBack} 
            className="w-full bg-white text-black py-4.5 rounded-[24px] font-black text-sm active:scale-95 transition-all shadow-xl"
          >
            العودة للإعدادات والخصوصية
          </button>
        </div>
      </div>
    );
  }

  // واجهة المعالجة (Chic Style)
  if (submissionState === 'processing') {
    return (
      <div className="h-screen bg-black text-white p-10 flex flex-col items-center justify-center text-center animate-fade-in">
        <div className="w-full max-w-xs space-y-12">
           <div className="relative flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-white/5 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <Loader2 size={40} className="text-blue-500 animate-spin" />
              </div>
           </div>

           <div className="space-y-6">
              <h2 className="text-xl font-black italic">جاري معالجة طلبك...</h2>
              <div className="space-y-3">
                 {steps.map((step, i) => (
                   <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i <= processStep ? 'opacity-100' : 'opacity-20 translate-y-2'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${i === processStep ? 'bg-blue-500 border-blue-500 animate-pulse' : i < processStep ? 'bg-green-500 border-green-500' : 'bg-white/5 border-white/10'}`}>
                         {i < processStep ? <CheckCircle size={14} /> : step.icon}
                      </div>
                      <span className="text-[11px] font-black text-zinc-400">{step.label}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    );
  }

  // واجهة الطلب المعلق (عند فتح الصفحة مرة أخرى)
  if (user.verificationStatus === 'pending') {
    return (
      <div className="h-screen bg-[#050505] text-white flex flex-col animate-fade-in font-sans" dir="rtl">
        <div className="p-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-[100]">
          <button onClick={onBack} className="p-2 bg-white/5 rounded-full"><ChevronRight size={24} /></button>
          <h2 className="text-lg font-black tracking-tight italic">حالة الطلب</h2>
          <div className="w-10"></div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
           <div className="relative">
              <div className="w-32 h-32 bg-yellow-500/10 rounded-[45px] flex items-center justify-center relative rotate-12">
                 <Clock size={56} className="text-yellow-500 animate-pulse" />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-black border border-white/10 rounded-full flex items-center justify-center animate-bounce">
                 <Sparkles size={20} className="text-yellow-500" />
              </div>
           </div>

           <div className="space-y-4">
              <h3 className="text-2xl font-black">طلبك معلق حالياً</h3>
              <p className="text-sm text-zinc-500 font-bold leading-relaxed max-w-[280px] mx-auto">
                نحن نعالج طلب التوثيق الخاص بك بعناية فائقة. لا يمكنك إرسال طلب جديد حتى نقوم بالرد على طلبك الحالي. شكراً لصبرك.
              </p>
           </div>

           <div className="w-full bg-white/5 p-6 rounded-[35px] border border-white/10 space-y-4">
              <div className="flex justify-between items-center text-[11px] font-black uppercase">
                 <span className="text-zinc-500">المرحلة الحالية</span>
                 <span className="text-yellow-500">المراجعة النهائية</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                 <div className="w-[85%] h-full bg-yellow-500 shadow-[0_0_10px_#eab308]"></div>
              </div>
           </div>

           <button onClick={onBack} className="w-full py-4.5 rounded-[26px] bg-white/5 border border-white/10 text-zinc-400 font-black text-xs uppercase tracking-[0.2em] active:scale-95">العودة للإعدادات</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl shrink-0 sticky top-0 z-[100]">
        <button onClick={onBack} className="p-2 bg-white/5 rounded-full active:scale-90 transition-transform"><ChevronRight size={24} /></button>
        <h2 className="text-lg font-black tracking-tight">مركز التوثيق الآمن</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-40">
          <div className="space-y-10 animate-fade-in">
             {/* Intro Card */}
            <div className="bg-gradient-to-br from-blue-900/20 to-black rounded-[40px] p-8 border border-blue-500/20 shadow-2xl relative overflow-hidden">
               <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-[22px] flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6 rotate-3">
                     <ShieldCheck size={32} className="text-white" />
                  </div>
                  <h1 className="text-xl font-black mb-2">وثق حضورك في تيك بوك</h1>
                  <p className="text-[10px] text-zinc-500 font-bold leading-relaxed max-w-[280px] uppercase tracking-widest">
                    تحقق من هويتك للحصول على الشارة الزرقاء وزيادة المصداقية
                  </p>
               </div>
            </div>

            {/* Steps Section */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
                <AlertCircle size={14} className="text-blue-500" /> تحميل المستندات الرسمية
              </h3>

              <div className="grid grid-cols-2 gap-4">
                 {/* ID Front */}
                 <div onClick={() => fileRefs.front.current?.click()} className="aspect-square bg-zinc-900 rounded-[35px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden relative group">
                    {images.idFront ? (
                      <img src={images.idFront} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <CreditCard size={28} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                        <span className="text-[9px] font-black text-zinc-500">الهوية (الوجه الأمامي)</span>
                      </>
                    )}
                    <input type="file" ref={fileRefs.front} onChange={(e) => handleFileChange(e, 'idFront')} className="hidden" accept="image/*" />
                 </div>

                 {/* ID Back */}
                 <div onClick={() => fileRefs.back.current?.click()} className="aspect-square bg-zinc-900 rounded-[35px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden relative group">
                    {images.idBack ? (
                      <img src={images.idBack} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <ImageIcon size={28} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                        <span className="text-[9px] font-black text-zinc-500">الهوية (الوجه الخلفي)</span>
                      </>
                    )}
                    <input type="file" ref={fileRefs.back} onChange={(e) => handleFileChange(e, 'idBack')} className="hidden" accept="image/*" />
                 </div>

                 {/* Selfie with ID */}
                 <div onClick={() => fileRefs.selfie.current?.click()} className="col-span-2 aspect-video bg-zinc-900 rounded-[35px] border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden relative group">
                    {images.selfie ? (
                      <img src={images.selfie} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <UserCheck size={32} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                        <span className="text-[9px] font-black text-zinc-500">سيلفي وأنت تحمل الهوية بجانب وجهك</span>
                      </>
                    )}
                    <input type="file" ref={fileRefs.selfie} onChange={(e) => handleFileChange(e, 'selfie')} className="hidden" accept="image/*" />
                 </div>
              </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] px-2">التصنيف والسبب</h3>
               
               <div className="flex flex-wrap gap-2">
                 {categories.map(cat => (
                   <button 
                     key={cat}
                     onClick={() => setFormData({...formData, category: cat})}
                     className={`px-5 py-3 rounded-2xl text-[10px] font-bold transition-all border ${formData.category === cat ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105' : 'bg-white/5 border-white/5 text-zinc-500'}`}
                   >
                     {cat}
                   </button>
                 ))}
               </div>

               <textarea 
                 value={formData.reason}
                 onChange={(e) => setFormData({...formData, reason: e.target.value})}
                 placeholder="اكتب نبذة قصيرة عن أهمية توثيق حسابك..."
                 className="w-full bg-zinc-900 border border-white/5 rounded-[30px] p-6 text-sm h-32 focus:ring-1 focus:ring-blue-500 outline-none resize-none leading-relaxed"
               />
            </div>

            <div className="bg-blue-600/5 border border-blue-600/10 p-6 rounded-[35px] flex gap-4 items-start">
               <Info size={24} className="text-blue-500 shrink-0 mt-1" />
               <div className="flex flex-col gap-1">
                  <h4 className="text-xs font-black text-blue-500">إرشادات أمنية</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-bold">
                    نحن نستخدم تقنيات التشفير المتقدمة لحماية مستنداتك. سيتم حذف الصور فور الانتهاء من عملية التحقق.
                  </p>
               </div>
            </div>
          </div>
      </div>

      <div className="p-6 pb-12 bg-gradient-to-t from-black via-black/90 to-transparent fixed bottom-0 left-0 right-0 z-[110]">
        <button 
          onClick={handleSubmit}
          disabled={submissionState !== 'idle' || !images.idFront}
          className={`w-full py-4.5 rounded-[28px] font-black text-lg transition-all flex items-center justify-center gap-3 ${
            submissionState !== 'idle' || !images.idFront 
            ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
            : 'bg-blue-600 text-white shadow-2xl shadow-blue-500/20 active:scale-[0.98]'
          }`}
        >
          <Send size={20} /> إرسال طلب التوثيق
        </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes scaleUp { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-scale-up { animation: scaleUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default VerificationRequestPage;
