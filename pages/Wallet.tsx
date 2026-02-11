import React, { useState, useEffect } from 'react';
import { ChevronRight, Info, CreditCard, Landmark, Smartphone, Star, History, ChevronLeft } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { User as UserType } from '../types';

const Wallet: React.FC<{ onBack: () => void; onChargeSuccess?: (amount: number) => void }> = ({ onBack, onChargeSuccess }) => {
  const [selectedPackage, setSelectedPackage] = useState<number | 'custom' | null>(30);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState<number>(18.15);
  const currentUser: UserType = JSON.parse(localStorage.getItem('tikbook_user') || JSON.stringify(MOCK_USER));

  const packages = [
    { coins: 30, price: 18.15 },
    { coins: 100, price: 60.45 },
    { coins: 150, price: 90.65 },
    { coins: 300, price: 185 },
    { coins: 500, price: 305 },
    { coins: 1000, price: 605 },
    { coins: 2000, price: 1209 },
  ];

  useEffect(() => {
    if (selectedPackage === 'custom') {
      const amount = parseFloat(customAmount) || 0;
      setTotalPrice(amount * 0.605);
    } else {
      const pkg = packages.find(p => p.coins === selectedPackage);
      setTotalPrice(pkg ? pkg.price : 0);
    }
  }, [selectedPackage, customAmount]);

  const handleCharge = () => {
    const amount = selectedPackage === 'custom' ? parseInt(customAmount) : (selectedPackage || 0);
    if (amount > 0) {
      onChargeSuccess?.(amount);
      alert(`تم شحن ${amount} عملة بنجاح!`);
      onBack();
    }
  };

  return (
    <div className="h-screen bg-[#FDFDFD] text-black font-sans flex flex-col overflow-hidden" dir="rtl">
      {/* Top Header */}
      <div className="px-4 py-4 flex items-center justify-between bg-white border-b border-zinc-100 shrink-0">
        <button onClick={onBack} className="p-1">
          <ChevronRight size={28} className="text-zinc-800" />
        </button>
        <h2 className="text-[17px] font-bold text-zinc-800">احصل على عملات</h2>
        <button className="text-[13px] font-medium text-zinc-500">عرض سجل المعاملات</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* User Info Bar */}
        <div className="flex items-center gap-4 px-5 py-6 bg-white">
          <img src={currentUser.avatar} className="w-14 h-14 rounded-full border border-zinc-100 object-cover shadow-sm" />
          <div className="flex flex-col">
            <h3 className="text-[16px] font-bold text-zinc-900">{currentUser.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
               <span className="text-[11px] text-zinc-500 font-medium">رصيد هدايا:</span>
               <div className="flex items-center gap-1">
                  <span className="text-[11px] font-bold text-zinc-700">LIVE: 70 | 0.00$</span>
                  <div className="w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star size={10} fill="white" className="text-white" />
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Promo Banner */}
        <div className="px-5 py-3 bg-[#FFF9F9] border-y border-red-50/50 flex items-start gap-2">
           <Info size={14} className="text-red-400 mt-0.5 shrink-0" />
           <p className="text-[11px] text-red-400 font-bold leading-relaxed">
             الشحن: وفر حوالي 25% مع رسوم خدمة أقل للجهات الخارجية.
           </p>
        </div>

        {/* Packages Grid */}
        <div className="p-4 grid grid-cols-2 gap-3 pb-32">
          {packages.map((pkg) => (
            <button
              key={pkg.coins}
              onClick={() => setSelectedPackage(pkg.coins)}
              className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all ${
                selectedPackage === pkg.coins ? 'border-[#ff2d55] bg-red-50/10' : 'border-zinc-100 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[18px] font-black text-zinc-900">{pkg.coins}</span>
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star size={12} fill="white" className="text-white" />
                </div>
              </div>
              <span className="text-[13px] font-bold text-zinc-500">ج.م. {pkg.price.toFixed(2)}</span>
            </button>
          ))}

          {/* Custom Amount Package */}
          <button
            onClick={() => setSelectedPackage('custom')}
            className={`flex flex-col items-center justify-center p-5 rounded-xl border-2 transition-all ${
              selectedPackage === 'custom' ? 'border-[#ff2d55] bg-red-50/10' : 'border-zinc-100 bg-white'
            }`}
          >
            {selectedPackage === 'custom' ? (
              <div className="flex flex-col items-center gap-1">
                <input
                  autoFocus
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0"
                  className="w-20 text-center font-black text-lg bg-transparent border-b border-zinc-300 outline-none"
                />
                <span className="text-[11px] font-bold text-zinc-400">مبلغ مخصص</span>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[16px] font-bold text-zinc-500">مبلغ مخصص</span>
                  <div className="w-5 h-5 border-2 border-yellow-400 rounded-full flex items-center justify-center">
                    <Star size={12} fill="#eab308" className="text-yellow-400" />
                  </div>
                </div>
                <span className="text-[13px] font-bold text-zinc-300">...</span>
              </>
            )}
          </button>
        </div>

         <div className="px-6 py-4 border-t border-zinc-200">
           <div className="bg-red-50 p-2 rounded-lg text-red-500 shrink-0">
              <Star size={20} fill="currentColor" />
           </div>
           <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
             اشحن على الأقل بمقدار 1,000 عملة لمرتين أكثر كي تفتح هدايا مميزة، تنتهي الصلاحية بعد 5 س 39 د {">"}
           </p>
        </div>
      </div>

      {/* Persistent Payment Footer */}
      <div className="bg-white border-t border-zinc-100 p-4 pb-10 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between mb-4">
           <span className="text-[13px] font-bold text-zinc-400">طريقة الدفع</span>
           <div className="flex items-center gap-3 grayscale opacity-60">
              <img src="https://cdn-icons-png.flaticon.com/512/349/349221.png" className="h-4" alt="Visa" />
              <img src="https://cdn-icons-png.flaticon.com/512/349/349228.png" className="h-4" alt="MasterCard" />
              <div className="flex items-center gap-1">
                <Smartphone size={12} /> <span className="text-[10px] font-black">Cash</span>
              </div>
              <span className="text-[10px] font-black text-blue-800">Fawry</span>
              <span className="text-[10px] font-black text-green-700">Meeza</span>
           </div>
        </div>

        <div className="flex items-center justify-between mb-4">
           <h3 className="text-[18px] font-bold text-zinc-900">الإجمالي: ج.م. {totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
        </div>

        <button
          onClick={handleCharge}
          className="w-full bg-[#ff2d55] text-white py-4 rounded-xl font-black text-[17px] active:scale-[0.98] transition-all shadow-lg shadow-red-100"
        >
          الشحن
        </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Wallet;
