
import React, { useState, useRef, useEffect } from 'react';
// Added ChevronRight to imports
import { Music, X, RotateCcw, Timer, Wand2, Zap, ZapOff, Image as ImageIcon, ChevronDown, ChevronRight, Smile, Radio, Sparkles, Camera } from 'lucide-react';
import { Post, User, Room } from '../types';

interface UploadProps {
  onBack: () => void;
  onUpload: (post: Post) => void;
  onStartLive: (room: Room) => void;
  currentUser: User;
}

const Upload: React.FC<UploadProps> = ({ onBack, onUpload, onStartLive, currentUser }) => {
  const [viewMode, setViewMode] = useState<'camera' | 'live' | 'review'>('camera');
  const [recordMode, setRecordMode] = useState<'15s' | '60s' | '10m'>('15s');
  const [isRecording, setIsRecording] = useState(false);
  const [flashOn, setFlashOn] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [activeFilter, setActiveFilter] = useState<string>('none');
  const [showFilters, setShowFilters] = useState(false);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [description, setDescription] = useState('');
  const [liveTitle, setLiveTitle] = useState('');
  const [liveBg, setLiveBg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const liveBgRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: true
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  useEffect(() => {
    if (viewMode !== 'review') {
      startCamera();
    }
    return () => {
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [facingMode, viewMode]);

  // Ensure video element gets stream if viewMode changes back
  useEffect(() => {
    if (videoRef.current && stream && viewMode !== 'review') {
      videoRef.current.srcObject = stream;
    }
  }, [viewMode, stream]);

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  const toggleFlash = async () => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    try {
      const capabilities = track.getCapabilities() as any;
      if (capabilities.torch) {
        await track.applyConstraints({ 
          advanced: [{ torch: !flashOn }] 
        } as any);
        setFlashOn(!flashOn);
      } else {
        setFlashOn(!flashOn);
      }
    } catch (e) {
      setFlashOn(!flashOn);
    }
  };

  const handleCapture = () => {
    if (viewMode === 'live') return;
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Mock recording
      setTimeout(() => {
        setPreview('https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-1282-large.mp4');
        setFileType('video');
        setViewMode('review');
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreview(ev.target?.result as string);
        setFileType(file.type.startsWith('video') ? 'video' : 'image');
        setViewMode('review');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartLive = () => {
    if (!liveTitle.trim()) {
      alert("يرجى كتابة عنوان للبث المباشر");
      return;
    }
    
    const newRoom: Room = {
      id: `r-${Date.now()}`,
      title: liveTitle,
      hostId: currentUser.id,
      activeMics: 1,
      viewers: 0,
      category: 'عام',
      coverImage: liveBg || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1000&auto=format&fit=crop'
    };

    onStartLive(newRoom);
  };

  const filters = [
    { name: 'طبيعي', value: 'none' },
    { name: 'باهر', value: 'brightness(1.2) contrast(1.1)' },
    { name: 'كلاسيك', value: 'sepia(0.3) contrast(1.1)' },
    { name: 'بارد', value: 'hue-rotate(200deg)' },
    { name: 'درامي', value: 'grayscale(1) contrast(1.5)' },
  ];

  const SidebarIcon = ({ icon: Icon, label, onClick, active = false }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-1 group active:scale-90 transition-transform">
      <div className={`p-2 rounded-full transition-colors ${active ? 'bg-yellow-500 text-black' : 'text-white'}`}>
        <Icon size={26} strokeWidth={2.2} className="drop-shadow-lg" />
      </div>
      <span className="text-[10px] font-black text-white drop-shadow-md">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[500] bg-black text-white flex flex-col font-sans overflow-hidden select-none" dir="rtl">
      {viewMode !== 'review' && (
        <div className="relative flex-1 flex flex-col">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`absolute inset-0 w-full h-full object-cover ${facingMode === 'user' ? '-scale-x-100' : ''}`}
            style={{ filter: activeFilter }}
          />
          
          <div className="relative z-10 p-4 pt-12 flex items-center justify-between bg-gradient-to-b from-black/40 to-transparent">
            <button onClick={onBack} className="p-2 text-white drop-shadow-lg"><X size={30} /></button>
            <button className="bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 flex items-center gap-2 active:scale-95 transition-transform pointer-events-auto">
               <Music size={16} className="text-white" />
               <span className="text-xs font-black">إضافة صوت</span>
            </button>
            <div className="w-10"></div>
          </div>

          <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-5">
            <SidebarIcon icon={RotateCcw} label="قلب" onClick={toggleCamera} />
            <SidebarIcon icon={Timer} label="السرعة" />
            <SidebarIcon icon={Wand2} label="فلاتر" onClick={() => setShowFilters(!showFilters)} active={showFilters} />
            <SidebarIcon icon={Smile} label="تجميل" />
            <SidebarIcon icon={Timer} label="مؤقت" />
            <SidebarIcon 
              icon={flashOn ? Zap : ZapOff} 
              label="فلاش" 
              onClick={toggleFlash} 
              active={flashOn}
            />
            <button className="p-2 text-white opacity-60"><ChevronDown size={24} /></button>
          </div>

          {showFilters && (
            <div className="absolute right-16 top-1/2 -translate-y-1/2 z-20 bg-black/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10 flex flex-col gap-2 animate-fade-in">
              {filters.map(f => (
                <button 
                  key={f.name}
                  onClick={() => setActiveFilter(f.value)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${activeFilter === f.value ? 'bg-yellow-500 text-black' : 'text-white hover:bg-white/10'}`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          )}

          <div className="mt-auto relative z-10 flex flex-col items-center gap-6 pb-12 bg-gradient-to-t from-black/80 to-transparent">
            {viewMode === 'camera' ? (
              <>
                <div className="flex items-center gap-8 mb-2">
                   {['15 ث', '60 ث', '10 د'].map((mode) => (
                     <button 
                       key={mode}
                       onClick={() => setRecordMode(mode as any)}
                       className={`text-[13px] font-black transition-all ${recordMode === mode ? 'text-white scale-110 underline decoration-yellow-500 underline-offset-4' : 'text-white/40'}`}
                     >
                       {mode}
                     </button>
                   ))}
                </div>

                <div className="flex items-center justify-center gap-14 w-full px-10">
                  <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center overflow-hidden active:scale-90 transition-transform">
                       <ImageIcon size={24} className="text-white" />
                    </div>
                    <span className="text-[11px] font-black">تحميل</span>
                  </div>

                  <button 
                    onClick={handleCapture}
                    className="relative flex items-center justify-center group active:scale-90 transition-transform"
                  >
                    <div className="w-20 h-20 rounded-full border-[6px] border-white/30 flex items-center justify-center">
                       <div className={`transition-all duration-300 ${isRecording ? 'w-10 h-10 bg-red-500 rounded-lg' : 'w-16 h-16 bg-white rounded-full'}`}></div>
                    </div>
                    {isRecording && <div className="absolute inset-[-8px] border-2 border-red-500 rounded-full animate-ping"></div>}
                  </button>

                  <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center active:scale-90 transition-transform">
                       <Smile size={24} className="text-white" />
                    </div>
                    <span className="text-[11px] font-black">مؤثرات</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full px-6 animate-slide-up">
                 <div className="bg-black/60 backdrop-blur-2xl p-6 rounded-[40px] border border-white/10 space-y-5 shadow-2xl">
                    <div className="flex items-center gap-4">
                       <div className="w-20 h-20 bg-zinc-800 rounded-3xl border border-white/10 flex items-center justify-center relative overflow-hidden group cursor-pointer" onClick={() => liveBgRef.current?.click()}>
                          {liveBg ? <img src={liveBg} className="w-full h-full object-cover" /> : <Camera size={24} className="text-zinc-500" />}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Sparkles size={16} /></div>
                       </div>
                       <div className="flex-1">
                          <input 
                            type="text" 
                            placeholder="أضف عنواناً للبث..." 
                            value={liveTitle}
                            onChange={(e) => setLiveTitle(e.target.value)}
                            className="w-full bg-transparent border-none text-lg font-black placeholder-white/30 focus:ring-0 text-white"
                          />
                          <div className="h-px bg-white/10 mt-2"></div>
                       </div>
                    </div>
                    <button 
                      onClick={handleStartLive}
                      className="w-full bg-red-600 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-red-600/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <Radio size={20} /> بدء بث مباشر
                    </button>
                 </div>
              </div>
            )}

            <div className="flex items-center gap-12 mt-4">
              <button 
                onClick={() => setViewMode('live')}
                className={`text-[15px] font-black transition-all ${viewMode === 'live' ? 'text-white underline decoration-red-500 underline-offset-8' : 'text-white/40'}`}
              >
                LIVE
              </button>
              <button 
                onClick={() => setViewMode('camera')}
                className={`text-[15px] font-black transition-all ${viewMode === 'camera' ? 'text-white underline decoration-white underline-offset-8' : 'text-white/40'}`}
              >
                منشور
              </button>
            </div>
          </div>
        </div>
      )}

      {viewMode === 'review' && (
        <div className="flex-1 flex flex-col bg-zinc-950 animate-fade-in">
          <div className="p-4 flex items-center justify-between border-b border-white/5 pt-12">
            <button onClick={() => setViewMode('camera')} className="p-1"><ChevronRight size={28} /></button>
            <h2 className="text-sm font-black text-yellow-500">مراجعة المنشور</h2>
            <button 
              onClick={() => {
                onUpload({
                  id: `p-${Date.now()}`,
                  userId: currentUser.id,
                  type: fileType || 'video',
                  url: preview!,
                  thumbnail: preview!,
                  description: description || 'منشور جديد من تيك بوك 🔥',
                  musicTitle: 'الصوت الأصلي',
                  likes: 0, comments: 0, shares: 0, views: 0, hashtags: []
                });
              }}
              className="bg-[#ff0050] text-white px-5 py-2 rounded-xl text-xs font-black shadow-lg shadow-red-500/20 active:scale-90 transition-transform"
            >
              نشر
            </button>
          </div>
          
          <div className="p-6 space-y-6 flex-1 overflow-y-auto no-scrollbar">
            <div className="aspect-[9/14] w-full bg-zinc-900 rounded-[40px] overflow-hidden border border-white/5 shadow-2xl">
              {fileType === 'video' ? (
                <video src={preview!} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={preview!} className="w-full h-full object-cover" />
              )}
            </div>
            
            <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب وصفاً جذاباً..."
                className="w-full bg-transparent border-none text-sm h-24 focus:ring-0 resize-none text-white"
              />
            </div>
          </div>
        </div>
      )}

      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="video/*,image/*" className="hidden" />
      <input type="file" ref={liveBgRef} onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => setLiveBg(ev.target?.result as string);
          reader.readAsDataURL(file);
        }
      }} className="hidden" accept="image/*" />

      <style>{`
        .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.25, 1, 0.5, 1); }
        .animate-fade-in { animation: fadeIn 0.3s ease-out; }
        @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default Upload;
