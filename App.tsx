
import React, { useState, useEffect } from 'react';
import { Home, Radio, Plus, Inbox, User, ShieldCheck, MessageSquare, UserCircle, ChevronRight, Users, Heart, Archive, Bell, Info } from 'lucide-react';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Wallet from './pages/Wallet';
import Admin from './pages/Admin';
import LiveRoom from './pages/LiveRoom';
import LiveList from './pages/LiveList';
import ChatList from './pages/ChatList';
import ChatDetail from './pages/ChatDetail';
import Explore from './pages/Explore';
import Upload from './pages/Upload';
import Settings from './pages/Settings';
import EditProfile from './pages/EditProfile';
import StoryUpload from './pages/StoryUpload';
import StoryView from './pages/StoryView';
import Earnings from './pages/Earnings';
import Referral from './pages/Referral';
import Login from './pages/Login';
import Followers from './pages/Followers';
import Activity from './pages/Activity';
import SystemNotifs from './pages/SystemNotifs';
import VerificationRequestPage from './pages/VerificationRequestPage';
import SupporterLevel from './pages/SupporterLevel';
import { AppRoute, Post, User as UserType, Gift, SystemNotification, Story, VerificationRequest, WithdrawalRequest, Room } from './types';
import { MOCK_POSTS, MOCK_USER, MOCK_ROOMS } from './constants';
import { api } from './services/api';

const SUPER_ADMIN_EMAIL = "ssocialmediaservice573@gmail.com"; 
const SUPER_ADMIN_PASS = "admin123"; 

const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>(() => {
    const saved = localStorage.getItem('tikbook_session');
    return saved ? AppRoute.HOME : AppRoute.LOGIN;
  });
  
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserType>(() => {
    const saved = localStorage.getItem('tikbook_user');
    return saved ? JSON.parse(saved) : { ...MOCK_USER, id: 'temp', coins: 0, supporterLevel: 1 };
  });

  const [posts, setPosts] = useState<Post[]>([]);
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('tikbook_rooms');
    return saved ? JSON.parse(saved) : MOCK_ROOMS;
  });
  const [stories, setStories] = useState<Story[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRoomData, setSelectedRoomData] = useState<any>(null);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);

  const refreshAppData = async () => {
    const users = await api.getAllUsers();
    setAllUsers(users);
    
    const savedPosts = localStorage.getItem('tikbook_posts');
    setPosts(savedPosts ? JSON.parse(savedPosts) : MOCK_POSTS);

    const savedVerif = localStorage.getItem('tikbook_verification_requests');
    setVerificationRequests(savedVerif ? JSON.parse(savedVerif) : []);
    
    const savedWithdr = localStorage.getItem('tikbook_withdrawal_requests');
    setWithdrawalRequests(savedWithdr ? JSON.parse(savedWithdr) : []);

    const savedStories = localStorage.getItem('tikbook_stories');
    setStories(savedStories ? JSON.parse(savedStories) : []);

    const savedNotifs = localStorage.getItem('tikbook_notifications');
    setNotifications(savedNotifs ? JSON.parse(savedNotifs) : []);

    const savedRooms = localStorage.getItem('tikbook_rooms');
    if (savedRooms) setRooms(JSON.parse(savedRooms));
  };

  useEffect(() => {
    refreshAppData();
  }, [currentRoute]);

  const handleLogin = async (formData: any, mode: 'login' | 'signup') => {
    if (mode === 'login') {
      if (formData.identifier === SUPER_ADMIN_EMAIL && formData.password === SUPER_ADMIN_PASS) {
        const adminUser: UserType = { 
          ...MOCK_USER, id: 'admin-root', email: SUPER_ADMIN_EMAIL, 
          role: 'admin', name: 'المسؤول الرئيسي', username: 'admin_root', 
          coins: 1000000, isVerified: true, supporterLevel: 50 
        };
        await api.syncUserToAdminList(adminUser);
        setCurrentUser(adminUser);
        localStorage.setItem('tikbook_user', JSON.stringify(adminUser));
        localStorage.setItem('tikbook_session', 'active');
        setCurrentRoute(AppRoute.HOME);
        return;
      }
      const users = await api.getAllUsers();
      const user = users.find((u: any) => (u.email === formData.identifier || u.username === formData.identifier) && u.password === formData.password);
      if (user) {
        setCurrentUser(user);
        localStorage.setItem('tikbook_user', JSON.stringify(user));
        localStorage.setItem('tikbook_session', 'active');
        setCurrentRoute(AppRoute.HOME);
      } else {
        alert('بيانات الدخول غير صحيحة');
      }
    } else {
      const newUser: UserType & { password?: string } = {
        ...MOCK_USER, id: `u-${Date.now()}`, name: formData.name, username: formData.username,
        email: formData.email, password: formData.password, coins: formData.referralCode ? 10 : 0,
        role: 'user', isVerified: false, supporterLevel: 1, earnings: 0,
        followers: 0, following: 0, likes: 0
      };
      await api.syncUserToAdminList(newUser);
      setCurrentUser(newUser);
      localStorage.setItem('tikbook_user', JSON.stringify(newUser));
      localStorage.setItem('tikbook_session', 'active');
      setCurrentRoute(AppRoute.HOME);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<UserType>) => {
    const updated = await api.updateProfile(userId, updates);
    if (userId === currentUser.id) {
      setCurrentUser(updated);
      localStorage.setItem('tikbook_user', JSON.stringify(updated));
    }
    refreshAppData();
    return updated;
  };

  const handleVerificationSubmit = async (req: any) => {
     const savedVerif = JSON.parse(localStorage.getItem('tikbook_verification_requests') || '[]');
     const newReq = { ...req, id: `v-${Date.now()}`, timestamp: new Date().toISOString(), status: 'pending' };
     const updated = [newReq, ...savedVerif];
     localStorage.setItem('tikbook_verification_requests', JSON.stringify(updated));
     setVerificationRequests(updated);

     const updatedUser = await handleUpdateUser(currentUser.id, { verificationStatus: 'pending' });
     setCurrentUser(updatedUser);
     localStorage.setItem('tikbook_user', JSON.stringify(updatedUser));
  };

  const handleAdminVerificationAction = async (requestId: string, status: 'approved' | 'rejected', reason?: string) => {
    const savedRequests = JSON.parse(localStorage.getItem('tikbook_verification_requests') || '[]');
    const request = savedRequests.find((r: any) => r.id === requestId);
    if (!request) return;

    request.status = status;
    localStorage.setItem('tikbook_verification_requests', JSON.stringify(savedRequests));
    setVerificationRequests([...savedRequests]);

    const updates: Partial<UserType> = {
      verificationStatus: status === 'approved' ? 'none' : 'rejected',
      isVerified: status === 'approved' ? true : request.isVerified
    };
    await handleUpdateUser(request.userId, updates);

    const newNotif: SystemNotification = {
      id: `n-${Date.now()}`,
      userId: request.userId,
      title: status === 'approved' ? 'تهانينا! تم توثيق حسابك' : 'طلب التوثيق مرفوض',
      description: status === 'approved' ? 'لقد تمت مراجعة مستنداتك وحصلت على الشارة الزرقاء الملكية.' : `عذراً، تم رفض طلبك للسبب التالي: ${reason || 'المستندات غير واضحة'}`,
      timestamp: new Date().toISOString(),
      type: status === 'approved' ? 'reward' : 'security'
    };
    const currentNotifs = JSON.parse(localStorage.getItem('tikbook_notifications') || '[]');
    localStorage.setItem('tikbook_notifications', JSON.stringify([newNotif, ...currentNotifs]));
    setNotifications([newNotif, ...currentNotifs]);

    alert(status === 'approved' ? 'تم قبول التوثيق بنجاح' : 'تم رفض التوثيق بنجاح');
  };

  const handleAdminWithdrawalAction = async (requestId: string, status: 'completed' | 'rejected') => {
    const savedRequests = JSON.parse(localStorage.getItem('tikbook_withdrawal_requests') || '[]');
    const request = savedRequests.find((r: any) => r.id === requestId);
    if (!request) return;

    request.status = status;
    localStorage.setItem('tikbook_withdrawal_requests', JSON.stringify(savedRequests));
    setWithdrawalRequests([...savedRequests]);

    const newNotif: SystemNotification = {
      id: `n-${Date.now()}`,
      userId: request.userId,
      title: status === 'completed' ? 'تم تحويل أرباحك' : 'فشل طلب السحب',
      description: status === 'completed' ? `تم إرسال مبلغ ${request.amount} ج.م إلى محفظتك بنجاح.` : 'عذراً، تعذر إتمام عملية السحب. يرجى التواصل مع الدعم.',
      timestamp: new Date().toISOString(),
      type: status === 'completed' ? 'reward' : 'security'
    };
    const currentNotifs = JSON.parse(localStorage.getItem('tikbook_notifications') || '[]');
    localStorage.setItem('tikbook_notifications', JSON.stringify([newNotif, ...currentNotifs]));
    setNotifications([newNotif, ...currentNotifs]);

    alert(status === 'completed' ? 'تم تأكيد التحويل' : 'تم رفض الطلب');
  };

  const handleUploadPost = (newPost: Post) => {
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('tikbook_posts', JSON.stringify(updatedPosts));
    setCurrentRoute(AppRoute.HOME);
  };

  const handleStartLive = (newRoom: Room) => {
    const updatedRooms = [newRoom, ...rooms];
    setRooms(updatedRooms);
    localStorage.setItem('tikbook_rooms', JSON.stringify(updatedRooms));
    setSelectedRoomId(newRoom.id);
    setSelectedRoomData(newRoom);
    setCurrentRoute(AppRoute.ROOM_DETAIL);
  };

  const renderPage = () => {
    switch (currentRoute) {
      case AppRoute.LOGIN: return <Login onLogin={handleLogin} />;
      case AppRoute.HOME: return <Feed posts={posts} onProfileNavigate={(id) => { setSelectedProfileId(id); setCurrentRoute(AppRoute.PROFILE); }} onShareToStory={(p) => console.log('share', p)} />;
      case AppRoute.PROFILE: return <Profile posts={posts} userId={selectedProfileId} currentUser={currentUser} onBack={() => setCurrentRoute(AppRoute.HOME)} onNavigate={setCurrentRoute} onUpdateUser={handleUpdateUser} />;
      case AppRoute.STORE: return <Wallet onBack={() => setCurrentRoute(AppRoute.SETTINGS)} onChargeSuccess={async (amt) => { await api.chargeCoins(currentUser.id, amt); refreshAppData(); }} />;
      case AppRoute.CHAT: return <ChatList notifications={notifications} currentUser={currentUser} stories={stories} onChatSelect={(id) => { setSelectedChatId(id); setCurrentRoute(AppRoute.CHAT_DETAIL); }} onStorySelect={() => {}} onNavigate={setCurrentRoute} />;
      case AppRoute.CHAT_DETAIL: return <ChatDetail chatId={selectedChatId || 'dummy'} onBack={() => setCurrentRoute(AppRoute.CHAT)} />;
      case AppRoute.LIVE: return <LiveList rooms={rooms} onRoomSelect={(id, data) => { setSelectedRoomId(id); setSelectedRoomData(data); setCurrentRoute(AppRoute.ROOM_DETAIL); }} />;
      case AppRoute.ROOM_DETAIL: return <LiveRoom roomId={selectedRoomId || 'r1'} customData={selectedRoomData} onExit={() => { setCurrentRoute(AppRoute.LIVE); setSelectedRoomData(null); }} />;
      case AppRoute.ADMIN: return <Admin users={allUsers} posts={posts} verificationRequests={verificationRequests} withdrawalRequests={withdrawalRequests} onUserUpdate={handleUpdateUser} onUserDelete={(id) => {}} onSendNotif={() => {}} onDeletePost={() => {}} onHandleVerification={handleAdminVerificationAction} onHandleWithdrawal={handleAdminWithdrawalAction} onBack={() => setCurrentRoute(AppRoute.PROFILE)} />;
      case AppRoute.EDIT_PROFILE: return <EditProfile onBack={() => setCurrentRoute(AppRoute.PROFILE)} currentUser={currentUser} onUpdateUser={handleUpdateUser} />;
      case AppRoute.SUPPORTER_LEVEL: return <SupporterLevel user={currentUser} onBack={() => setCurrentRoute(AppRoute.SETTINGS)} onNavigate={setCurrentRoute} />;
      case AppRoute.UPLOAD: return <Upload onBack={() => setCurrentRoute(AppRoute.HOME)} onUpload={handleUploadPost} onStartLive={handleStartLive} currentUser={currentUser} />;
      case AppRoute.SETTINGS: return <Settings onBack={() => setCurrentRoute(AppRoute.PROFILE)} onLogout={() => { localStorage.removeItem('tikbook_session'); localStorage.removeItem('tikbook_user'); setCurrentRoute(AppRoute.LOGIN); }} onNavigate={setCurrentRoute} onUpdateUser={handleUpdateUser} />;
      
      case AppRoute.REFERRAL: return <Referral user={currentUser} onBack={() => setCurrentRoute(AppRoute.SETTINGS)} />;
      case AppRoute.VERIFICATION: return <VerificationRequestPage user={currentUser} onBack={() => setCurrentRoute(AppRoute.SETTINGS)} onSubmit={handleVerificationSubmit} />;
      case AppRoute.EARNINGS: return <Earnings user={currentUser} onBack={() => setCurrentRoute(AppRoute.SETTINGS)} onWithdrawRequest={() => {}} />;
      case AppRoute.FOLLOWERS: return <Followers onBack={() => setCurrentRoute(AppRoute.CHAT)} />;
      case AppRoute.ACTIVITY: return <Activity onBack={() => setCurrentRoute(AppRoute.CHAT)} />;
      case AppRoute.SYSTEM_NOTIFS: return <SystemNotifs notifications={notifications} onBack={() => setCurrentRoute(AppRoute.CHAT)} />;
      case AppRoute.STORY_UPLOAD: return <StoryUpload currentUser={currentUser} onBack={() => setCurrentRoute(AppRoute.CHAT)} onUpload={(s) => { setStories([s, ...stories]); setCurrentRoute(AppRoute.CHAT); }} />;

      default: return <Feed posts={posts} onProfileNavigate={(id) => { setSelectedProfileId(id); setCurrentRoute(AppRoute.PROFILE); }} />;
    }
  };

  const isNavVisible = ![
    AppRoute.LOGIN, AppRoute.CHAT_DETAIL, AppRoute.ROOM_DETAIL, AppRoute.ADMIN, 
    AppRoute.STORE, AppRoute.EDIT_PROFILE, AppRoute.UPLOAD, AppRoute.SETTINGS,
    AppRoute.FOLLOWERS, AppRoute.ACTIVITY, AppRoute.SYSTEM_NOTIFS, AppRoute.STORY_UPLOAD,
    AppRoute.EARNINGS, AppRoute.REFERRAL, AppRoute.VERIFICATION, AppRoute.SUPPORTER_LEVEL
  ].includes(currentRoute);

  return (
    <div className="max-w-md mx-auto h-screen bg-black shadow-2xl relative overflow-hidden font-sans border-x border-white/5" dir="rtl">
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">{renderPage()}</div>
      {isNavVisible && (
        <nav className={`absolute bottom-0 left-0 right-0 h-[84px] flex items-center justify-around px-2 z-[100] border-t pb-2 transition-colors duration-300 ${currentRoute === AppRoute.HOME ? 'bg-transparent border-transparent' : 'bg-white border-zinc-100'}`}>
          <button onClick={() => setCurrentRoute(AppRoute.HOME)} className={`flex flex-col items-center gap-1 transition-colors ${currentRoute === AppRoute.HOME ? 'text-white' : 'text-zinc-400'}`}>
            <Home size={26} strokeWidth={currentRoute === AppRoute.HOME ? 2.5 : 2} />
            <span className="text-[10px] font-bold">الرئيسية</span>
          </button>
          
          <button onClick={() => setCurrentRoute(AppRoute.LIVE)} className={`flex flex-col items-center gap-1 transition-colors ${currentRoute === AppRoute.LIVE ? 'text-black' : 'text-zinc-400'}`}>
            <Radio size={26} />
            <span className="text-[10px] font-bold">غرفة البث</span>
          </button>

          <button onClick={() => setCurrentRoute(AppRoute.UPLOAD)} className="relative w-[45px] h-[28px] mx-1 active:scale-90 transition-transform">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute left-[-2px] w-full h-full bg-[#00f2ea] rounded-[7px]"></div>
                <div className="absolute right-[-2px] w-full h-full bg-[#ff0050] rounded-[7px]"></div>
                <div className={`absolute inset-0 rounded-[7px] flex items-center justify-center transition-colors ${currentRoute === AppRoute.HOME ? 'bg-white text-black' : 'bg-black text-white'}`}>
                   <Plus size={20} strokeWidth={4} />
                </div>
             </div>
          </button>

          <button onClick={() => setCurrentRoute(AppRoute.CHAT)} className={`flex flex-col items-center gap-1 relative transition-colors ${currentRoute === AppRoute.CHAT || currentRoute === AppRoute.CHAT_DETAIL ? 'text-black' : 'text-zinc-400'}`}>
            <div className="relative">
              <MessageSquare size={26} fill={currentRoute === AppRoute.CHAT ? "currentColor" : "none"} />
              {notifications.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-white">
                  {notifications.length}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">صندوق الوارد</span>
          </button>
          
          <button onClick={() => { setSelectedProfileId(null); setCurrentRoute(AppRoute.PROFILE); }} className={`flex flex-col items-center gap-1 transition-colors ${currentRoute === AppRoute.PROFILE ? 'text-black' : 'text-zinc-400'}`}>
            <UserCircle size={26} />
            <span className="text-[10px] font-bold">الملف الشخصي</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
