
import React, { useState } from 'react';
import { ChevronRight, Landmark, Smartphone, ArrowUpRight, CheckCircle2, Loader2, Info } from 'lucide-react';
import { User, WithdrawalRequest } from '../types';

interface EarningsProps {
  user: User;
  onBack: () => void;
  onWithdrawRequest: (request: Omit<WithdrawalRequest, 'id' | 'timestamp' | 'status'>) => void;
}

const Earnings: React.FC<EarningsProps> = ({ user, onBack, onWithdrawRequest }) => {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // الرصيد الفعلي للمستخدم (يبدأ بـ 0 للمستخدمين الجدد)
  const currentEarnings = user.earnings || 0; 

  const handleWithdraw = () => {
    if (!phone || !amount) {
      alert('يرجى إدخال رقم الهاتف والمبلغ المراد سحبه.');
      return;
    }
    
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount <= 0) {
      alert('يرجى إدخال مبلغ صحيح.');
      return;
    }

    if (withdrawAmount > currentEarnings) {
      alert('عذراً، الرصيد المتاح غير كافٍ لإتمام هذه العملية.');
      return;
    }

    setIsLoading(true);
    
    // محاكاة الإرسال للإدارة
    setTimeout(() => {
      onWithdrawRequest({
        userId: user.id,
        userName: user.name,
        phone: phone,
        amount: withdrawAmount
      });
      setIsLoading(false);
      setIsSuccess(true);
      setPhone('');
      setAmount('');
    }, 1500);
  };

  return (
    <div className="h-screen bg-zinc-50 text-black font-sans flex flex-col overflow-hidden" dir="rtl">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between bg-white border-b border-zinc-100 shadow-sm sticky top-0 z-50 shrink-0">
        <button onClick={onBack} className="p-1 active:scale-90 transition-transform">
          <ChevronRight size={28} />
        </button>
        <h2 className="text-[18px] font-black">أرباح الهدايا 💰</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar pb-32">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-zinc-900 to-black rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
           <p className="text-zinc-400 text-xs font-bold mb-2">رصيدك القابل للسحب</p>
           <h1 className="text-4xl font-black">{currentEarnings.toLocaleString()} <span className="text-lg text-yellow-500">ج.م</span></h1>
           <div className="mt-6 flex items-center gap-2 bg-white/10 w-fit px-4 py-1.5 rounded-full border border-white/5">
              <span className="text-[10px] font-bold text-zinc-300">معدل التحويل: 100 عملة = 20 ج.م</span>
           </div>
        </div>

        {/* Withdraw Section */}
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-zinc-100">
           <h3 className="text-[16px] font-black mb-6 flex items-center gap-2">
              <Smartphone className="text-red-500" size={20} /> سحب عبر فودافون كاش
           </h3>
           
           <div className="space-y-4">
              <div>
                 <label className="text-[11px] text-zinc-400 font-bold mb-1.5 block px-2">رقم المحفظة (فودافون كاش)</label>
                 <input 
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-red-500 transition-all font-bold"
                 />
              </div>

              <div>
                 <label className="text-[11px] text-zinc-400 font-bold mb-1.5 block px-2">المبلغ المراد سحبه (ج.م)</label>
                 <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="مثال: 500"
                    className="w-full bg-zinc-50 border-none rounded-2xl py-4 px-5 text-sm focus:ring-2 focus:ring-red-500 transition-all font-bold"
                 />
              </div>

              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex gap-3 items-start">
                 <Info size={18} className="text-blue-500 shrink-0 mt-0.5" />
                 <p className="text-[10px] text-blue-700 leading-relaxed font-bold">
                    سيتم تحويل المبلغ خلال 24 ساعة عمل. يرجى التأكد من صحة الرقم المسجل حيث لا يمكن إلغاء الطلب بعد التنفيذ.
                 </p>
              </div>

              <button 
                onClick={handleWithdraw}
                disabled={isLoading || isSuccess || currentEarnings <= 0}
                className={`w-full py-4 rounded-2xl text-[16px] font-black flex items-center justify-center gap-2 transition-all active:scale-95 ${
                  isSuccess ? 'bg-green-500 text-white' : (currentEarnings <= 0 ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' : 'bg-red-600 text-white shadow-xl shadow-red-200')
                }`}
              >
                {isLoading ? <Loader2 className="animate-spin" /> : isSuccess ? <><CheckCircle2 /> تم إرسال الطلب للإدارة</> : 'تأكيد السحب الان'}
              </button>
           </div>
        </div>

        {/* History */}
        <div>
           <h4 className="text-sm font-black text-zinc-400 px-2 mb-3">سجل العمليات</h4>
           <div className="space-y-3">
              <div className="bg-white p-4 rounded-2xl flex justify-between items-center border border-zinc-100 italic">
                 <p className="text-[10px] text-zinc-400 w-full text-center font-bold">لا توجد عمليات سحب مكتملة حالياً</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
