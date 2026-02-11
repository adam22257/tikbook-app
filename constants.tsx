
import { Gift, Post, User, Room, ChatPreview } from './types';

export const MOCK_USER: User = {
  id: 'u1',
  name: 'أحمد علي',
  username: 'ahmed_dev',
  avatar: 'https://picsum.photos/200/200?random=1',
  bio: 'مطور تطبيقات وشغوف بالتكنولوجيا 🚀',
  followers: 12500,
  following: 340,
  likes: 89000,
  coins: 5000,
  supporterLevel: 1, 
  supporterExp: 0,
  frame: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
  isOnline: true,
  role: 'user',
  status: 'active'
};

export const MOCK_CHATS: ChatPreview[] = [
  {
    id: 'c1',
    user: { 
      id: 'u2', 
      name: 'ليلى منصور', 
      username: 'laila', 
      avatar: 'https://picsum.photos/100/100?random=2', 
      bio: '', 
      followers: 0, 
      following: 0, 
      likes: 0, 
      coins: 0, 
      supporterLevel: 5,
      supporterExp: 1000,
      isOnline: true,
      role: 'user',
      status: 'active'
    },
    lastMessage: 'هل شاهدت الفيديو الجديد؟ 🔥',
    timestamp: '10:30 ص',
    unreadCount: 2
  },
  {
    id: 'c2',
    user: { 
      id: 'u3', 
      name: 'خالد جاسم', 
      username: 'khaled', 
      avatar: 'https://picsum.photos/100/100?random=3', 
      bio: '', 
      followers: 0, 
      following: 0, 
      likes: 0, 
      coins: 0, 
      supporterLevel: 1,
      supporterExp: 0,
      isOnline: false,
      role: 'user',
      status: 'active'
    },
    lastMessage: 'شكراً على الهدية الرائعة! 🙏',
    timestamp: 'أمس',
    unreadCount: 0
  }
];

const generateGifts = (): Gift[] => {
  const baseGifts: Gift[] = [
    { id: 'g1', name: 'وردة', icon: '🌹', price: 1, animationType: 'static' },
    { id: 'g2', name: 'قلب', icon: '❤️', price: 5, animationType: 'static' },
    { id: 'g3', name: 'بوسة', icon: '💋', price: 10, animationType: 'animated' },
    { id: 'g4', name: 'شاي', icon: '☕', price: 2, animationType: 'static' },
    { id: 'g5', name: 'قهوة', icon: '☕', price: 3, animationType: 'static' },
    { id: 'g6', name: 'آيس كريم', icon: '🍦', price: 5, animationType: 'static' },
    { id: 'g7', name: 'دونات', icon: '🍩', price: 8, animationType: 'static' },
    { id: 'g8', name: 'بيتزا', icon: '🍕', price: 20, animationType: 'static' },
    { id: 'g9', name: 'كيك', icon: '🎂', price: 50, animationType: 'animated' },
    { id: 'g10', name: 'شوكلاتة', icon: '🍫', price: 15, animationType: 'static' },
    { id: 'g11', name: 'ماسة', icon: '💎', price: 100, animationType: 'animated' },
    { id: 'g12', name: 'خاتم', icon: '💍', price: 250, animationType: 'animated' },
    { id: 'g13', name: 'تاج', icon: '👑', price: 500, animationType: 'animated' },
    { id: 'g14', name: 'سيارة سباق', icon: '🏎️', price: 1000, animationType: 'vehicle' },
    { id: 'g15', name: 'يخت', icon: '🛥️', price: 2500, animationType: 'vehicle' },
    { id: 'g16', name: 'طائرة', icon: '🛩️', price: 5000, animationType: 'vehicle' },
    { id: 'g17', name: 'صاروخ', icon: '🚀', price: 8000, animationType: 'vehicle' },
    { id: 'g18', name: 'أسد', icon: '🦁', price: 15000, animationType: 'animated' },
    { id: 'g19', name: 'حوت', icon: '🐋', price: 25000, animationType: 'animated' },
    { id: 'g20', name: 'قلعة الملوك', icon: '🏰', price: 50000, animationType: 'vehicle' },
  ];

  const additional = Array.from({ length: 90 }).map((_, i) => ({
    id: `gx-${i}`,
    name: `هدية مميزة ${i + 1}`,
    icon: ['⭐', '🌟', '✨', '🔥', '🌈', '🧨', '🎈', '🎁', '🎀', '🪄', '💎', '🧿', '🍀', '🦋', '🐥', '🐼'][i % 16],
    price: Math.floor(Math.random() * 5000) + 1,
    animationType: (i % 5 === 0 ? 'animated' : 'static') as any
  }));

  return [...baseGifts, ...additional];
};

export const GIFTS = generateGifts();

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: 'u1',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-1282-large.mp4',
    thumbnail: 'https://picsum.photos/400/800?random=10',
    description: 'استمتع بالأجواء الرائعة في دبي #دبي #سفر',
    musicTitle: 'أغنية المساء - فنان العرب',
    likes: 1200,
    comments: 45,
    shares: 12,
    views: 5600,
    hashtags: ['دبي', 'سفر', 'تيك_بوك']
  },
  {
    id: 'p2',
    userId: 'u2',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-tree-with-yellow-flowers-1173-large.mp4',
    thumbnail: 'https://picsum.photos/400/800?random=11',
    description: 'جمال الطبيعة في فصل الربيع 🌸 #طبيعة',
    musicTitle: 'صوت العصافير الهادئ',
    likes: 3400,
    comments: 89,
    shares: 56,
    views: 12800,
    hashtags: ['طبيعة', 'ربيع']
  }
];

export const MOCK_ROOMS: Room[] = [
  { id: 'r1', title: 'سهرة غنائية مع الأصدقاء 🎤', hostId: 'u1', activeMics: 5, viewers: 120, category: 'موسيقى', coverImage: 'https://picsum.photos/400/300?random=20' },
  { id: 'r2', title: 'نقاش حول العملات الرقمية 💰', hostId: 'u2', activeMics: 3, viewers: 450, category: 'تقنية', coverImage: 'https://picsum.photos/400/300?random=21' },
  { id: 'r3', title: 'دردشة عامة وترفيه ☕', hostId: 'u3', activeMics: 8, viewers: 80, category: 'ترفيه', coverImage: 'https://picsum.photos/400/300?random=22' },
];
