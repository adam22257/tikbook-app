
import React, { useState } from 'react';
import { Users, Video, ShieldAlert, Trash2, UserX, UserCheck, MessageSquare, Send, X, ArrowRight, Ban, Clock, Ghost, ShieldCheck, Check, XCircle, Banknote, Smartphone, Crown, Star, Eye, Image as ImageIcon } from 'lucide-react';
import { User, Post, SystemNotification, VerificationRequest, WithdrawalRequest } from '../types';

interface AdminProps {
  users: User[];
  posts: Post[];
  verificationRequests: VerificationRequest[];
  withdrawalRequests: WithdrawalRequest[];
  onUserUpdate: (id: string, updates: Partial<User>) => void;
  onUserDelete: (id: string) => void;
  onSendNotif: (notif: Omit<SystemNotification, 'id' | 'timestamp'>) => void;
  onDeletePost: (id: string) => void;
  onHandleVerification: (requestId: string, status: 'approved' | 'rejected', reason?: string) => void;
  onHandleWithdrawal: (requestId: string, status: 'completed' | 'rejected') => void;
  onBack: () => void;
}

const Admin: React.FC<AdminProps> = ({ 
  users, 
  posts, 
  verificationRequests, 
  withdrawalRequests, 
  onUserUpdate, 
  onUserDelete, 
  onSendNotif, 
  onDeletePost, 
  onHandleVerification, 
  onHandleWithdrawal,
  onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'withdrawals' | 'verification' | 'content' | 'notify'>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [rejectForm, setRejectForm] = useState<{ id: string, reason: string } | null>(null);
  const [notifForm, setNotifForm] = useState({ target: 'all', title: '', desc: '', type: 'system' as any });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [newCoins, setNewCoins] = useState('');
  const [newLevel, setNewLevel] = useState('');

  const pendingVerifCount = verificationRequests.filter(r => r.status === 'pending').length;
  const pendingWithdrawCount = withdrawalRequests.filter(r => r.status === 'pending').length;

  const handleSendNotification = () => {
    if (!notifForm.title || !notifForm.desc) return;
    onSendNotif({
      userId: notifForm.target,
      title: notifForm.title,
      description: notifForm.desc,
      type: notifForm.type
    });
    alert('تم إرسال الإشعار بنجاح');
    setNotifForm({ target: 'all', title: '', desc: '', type: 'system' });
  };

  const handleUpdateUserFinance = () => {
    if (!selectedUser) return;
    const updates: Partial<User> = {};
    if (newCoins) updates.coins = parseInt(newCoins);
    if (newLevel) updates.supporterLevel = Math.min(50, Math.max(1, parseInt(newLevel)));
    
    onUserUpdate(selectedUser.id, updates);
    alert('تم تحديث بيانات المستخدم بنجاح');
    setSelectedUser(null);
  };

  const handleConfirmReject = () => {
    if (!rejectForm) return;
    onHandleVerification(rejectForm.id, 'rejected', rejectForm.reason);
    setRejectForm(null);
  };

  return (
    <div className="h-screen bg-zinc-950 text-white font-sans flex flex-col overflow-hidden" dir="rtl">
      <div className="p-6 bg-zinc-900 border-b border-white/5 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center text-black shadow-lg shadow-yellow-500/10"><ShieldAlert size={24} /></div>
          <h1 className="text-xl font-black">مركز التحكم</h1>
        </div>
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full"><ArrowRight size={24} /></button>
      </div>

      <div className="flex bg-zinc-900 px-4 overflow-x-auto no-scrollbar border-b border-white/5 shrink-0">
        {[
          { id: 'users', label: 'المستخدمين', badge: 0 },
          { id: 'withdrawals', label: 'طلبات السحب', badge: pendingWithdrawCount },
          { id: 'verification', label: 'التوثيق', badge: pendingVerifCount },
          { id: 'content', label: 'المحتوى', badge: 0 },
          { id: 'notify', label: 'الإشعارات', badge: 0 }
        ].map(tab => (
          <button 
            key={tab.id} 
            onClick={() => setActiveTab(tab.id as any)} 
            className={`px-6 py-4 text-[11px] font-black border-b-2 transition-all whitespace-nowrap flex items-center gap-2 relative ${activeTab === tab.id ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-zinc-500'}`}
          >
            {tab.label}
            {tab.badge > 0 && (
              <span className="bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24 no-scrollbar">
        {activeTab === 'users' && (
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="bg-zinc-900 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={user.avatar} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <h4 className="text-sm font-bold">{user.name} <span className="text-[8px] opacity-50">ID: {user.id}</span></h4>
                    <div className="flex gap-1.5 mt-1">
                      <span className={`text-[8px] px-2 rounded-full ${user.status === 'blocked' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
                        {user.status}
                      </span>
                      {user.role === 'admin' && <span className="text-[8px] px-2 rounded-full bg-yellow-500/20 text-yellow-500">مسؤول</span>}
                      <span className="text-[8px] px-2 rounded-full bg-zinc-800 text-blue-400">ليفل {user.supporterLevel}</span>
                      <span className="text-[8px] px-2 rounded-full bg-zinc-800 text-yellow-500">{user.coins || 0} عملة</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setSelectedUser(user); setNewCoins(user.coins.toString()); setNewLevel(user.supporterLevel.toString()); }} className="text-[10px] bg-white/5 px-3 py-1.5 rounded-lg border border-white/5 font-bold">إدارة</button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'withdrawals' && (
           <div className="space-y-4">
            {withdrawalRequests.length === 0 ? (
              <div className="text-center py-20 text-zinc-600 font-bold text-sm">لا توجد طلبات سحب حالياً</div>
            ) : (
              withdrawalRequests.filter(r => r.status === 'pending').map(req => (
                <div key={req.id} className="bg-zinc-900 p-6 rounded-[32px] border border-white/5 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center"><Smartphone size={20} /></div>
                      <div>
                        <h4 className="text-sm font-black">{req.userName}</h4>
                        <p className="text-[10px] text-zinc-500 font-bold">رقم فودافون: {req.phone}</p>
                      </div>
                    </div>
                    <div className="text-left">
                       <span className="text-lg font-black text-green-500">{req.amount} <span className="text-[10px]">ج.م</span></span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => onHandleWithdrawal(req.id, 'completed')}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black text-[11px] flex items-center justify-center gap-2"
                    >
                      <Check size={16} /> تأكيد التحويل
                    </button>
                    <button 
                      onClick={() => onHandleWithdrawal(req.id, 'rejected')}
                      className="flex-1 bg-red-600/10 text-red-600 border border-red-600/20 py-3 rounded-xl font-black text-[11px]"
                    >
                      رفض الطلب
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'verification' && (
          <div className="space-y-6">
             {verificationRequests.length === 0 ? (
               <div className="text-center py-20 text-zinc-600 font-bold text-sm">لا توجد طلبات معلقة</div>
             ) : (
               verificationRequests.filter(r => r.status === 'pending').map(req => (
                 <div key={req.id} className="bg-zinc-900 p-6 rounded-[40px] border border-white/5 space-y-6 animate-fade-in shadow-2xl">
                    <div className="flex items-center gap-4">
                       <img src={req.userAvatar} className="w-14 h-14 rounded-full object-cover border-2 border-zinc-800" />
                       <div className="flex-1">
                          <h4 className="text-[15px] font-black">{req.userName}</h4>
                          <span className="text-[9px] bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full font-black uppercase tracking-widest">{req.category}</span>
                       </div>
                    </div>

                    <div className="bg-black/40 p-5 rounded-3xl space-y-3">
                       <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">نبذة المستخدم</h5>
                       <p className="text-xs text-zinc-300 leading-relaxed italic">"{req.reason}"</p>
                    </div>

                    <div className="space-y-3">
                       <h5 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">مستندات إثبات الهوية</h5>
                       <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                          {[
                            { label: 'الوجه الأمامي', src: req.idFront },
                            { label: 'الوجه الخلفي', src: req.idBack },
                            { label: 'سيلفي مع الهوية', src: req.selfieWithId }
                          ].map((doc, idx) => (
                            doc.src ? (
                              <div key={idx} onClick={() => setPreviewImage(doc.src || null)} className="min-w-[120px] aspect-[4/3] bg-zinc-800 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5">
                                 <img src={doc.src} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                 <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Eye size={18} />
                                 </div>
                                 <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center">
                                    <span className="text-[7px] font-black">{doc.label}</span>
                                 </div>
                              </div>
                            ) : null
                          ))}
                       </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                       <button 
                         onClick={() => onHandleVerification(req.id, 'approved')}
                         className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
                       >
                         <UserCheck size={18} /> قبول الطلب
                       </button>
                       <button 
                         onClick={() => setRejectForm({ id: req.id, reason: '' })}
                         className="flex-1 bg-zinc-800 text-white py-4 rounded-2xl font-black text-xs border border-white/5"
                       >
                         رفض الطلب
                       </button>
                    </div>
                 </div>
               ))
             )}
          </div>
        )}

        {activeTab === 'notify' && (
          <div className="bg-zinc-900 p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="font-bold text-yellow-500">إرسال رسالة نظام</h3>
            <div>
              <label className="text-[10px] text-zinc-500 mb-1 block">المستهدف</label>
              <select value={notifForm.target} onChange={e => setNotifForm({...notifForm, target: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-yellow-500">
                <option value="all">الجميع</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 mb-1 block">عنوان الإشعار</label>
              <input value={notifForm.title} onChange={e => setNotifForm({...notifForm, title: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs outline-none focus:border-yellow-500" />
            </div>
            <textarea value={notifForm.desc} onChange={e => setNotifForm({...notifForm, desc: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs outline-none h-24" placeholder="نص الرسالة..." />
            <button onClick={handleSendNotification} className="w-full bg-yellow-500 text-black py-4 rounded-2xl font-black text-sm">إرسال</button>
          </div>
        )}
      </div>

      {/* مودال الرفض */}
      {rejectForm && (
        <div className="fixed inset-0 z-[600] bg-black/90 flex items-center justify-center p-6 backdrop-blur-md">
          <div className="bg-zinc-900 w-full max-w-sm rounded-[40px] p-8 border border-white/10 shadow-2xl">
             <h3 className="text-xl font-black mb-4">سبب الرفض</h3>
             <textarea 
               value={rejectForm.reason}
               onChange={(e) => setRejectForm({...rejectForm, reason: e.target.value})}
               placeholder="اكتب سبب الرفض (مثلاً: الصور غير واضحة)..."
               className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm h-32 outline-none focus:border-red-500"
             />
             <div className="flex gap-3 mt-6">
                <button onClick={handleConfirmReject} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-black text-xs">تأكيد الرفض</button>
                <button onClick={() => setRejectForm(null)} className="flex-1 bg-zinc-800 text-white py-3 rounded-xl font-black text-xs">إلغاء</button>
             </div>
          </div>
        </div>
      )}

      {/* مودال تكبير الصور */}
      {previewImage && (
        <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center p-4 animate-fade-in" onClick={() => setPreviewImage(null)}>
           <button onClick={() => setPreviewImage(null)} className="absolute top-10 left-6 p-3 bg-white/10 rounded-full text-white"><X size={24} /></button>
           <img src={previewImage} className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl object-contain border border-white/10" />
        </div>
      )}

      {/* مودال إدارة المستخدم */}
      {selectedUser && (
        <div className="fixed inset-0 z-[500] bg-black/90 flex items-center justify-center p-6 backdrop-blur-md overflow-y-auto">
          <div className="bg-zinc-900 w-full max-w-sm rounded-[40px] p-8 border border-white/10 relative my-auto">
            <button onClick={() => setSelectedUser(null)} className="absolute top-6 left-6 text-zinc-500"><X size={24} /></button>
            <div className="flex flex-col items-center mb-6">
              <img src={selectedUser.avatar} className="w-20 h-20 rounded-full object-cover mb-3" />
              <h3 className="text-xl font-black">{selectedUser.name}</h3>
              <p className="text-xs text-zinc-500">@{selectedUser.username}</p>
            </div>

            <div className="space-y-4 mb-8">
               <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <label className="text-[10px] text-zinc-500 font-black block mb-2">تعديل الرصيد (عملات)</label>
                  <input type="number" value={newCoins} onChange={(e) => setNewCoins(e.target.value)} className="bg-transparent border-none focus:ring-0 text-sm font-black w-full" />
               </div>
               <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                  <label className="text-[10px] text-zinc-500 font-black block mb-2">المستوى (1-50)</label>
                  <input type="number" value={newLevel} onChange={(e) => setNewLevel(e.target.value)} className="bg-transparent border-none focus:ring-0 text-sm font-black w-full" />
               </div>
               <button onClick={handleUpdateUserFinance} className="w-full bg-blue-600 text-white py-3 rounded-xl font-black text-xs">حفظ</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => { onUserUpdate(selectedUser.id, { role: selectedUser.role === 'admin' ? 'user' : 'admin' }); setSelectedUser(null); }} className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex flex-col items-center gap-2">
                <ShieldCheck size={24} className="text-yellow-500" />
                <span className="text-[10px] font-bold text-yellow-500">منصب الإدارة</span>
              </button>
              <button onClick={() => { onUserUpdate(selectedUser.id, { isVerified: !selectedUser.isVerified }); setSelectedUser(null); }} className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex flex-col items-center gap-2">
                <Check size={24} className="text-blue-500" />
                <span className="text-[10px] font-bold text-blue-500">توثيق</span>
              </button>
              <button onClick={() => { onUserUpdate(selectedUser.id, { status: selectedUser.status === 'blocked' ? 'active' : 'blocked' }); setSelectedUser(null); }} className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center gap-2">
                <Ban size={24} className="text-red-500" />
                <span className="text-[10px] font-bold text-red-500">حظر</span>
              </button>
              <button onClick={() => { if(confirm('حذف نهائي؟')) { onUserDelete(selectedUser.id); setSelectedUser(null); } }} className="p-4 bg-red-900/20 border border-red-900/50 rounded-2xl flex flex-col items-center gap-2">
                <Trash2 size={24} className="text-red-700" />
                <span className="text-[10px] font-bold text-red-700">حذف</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
