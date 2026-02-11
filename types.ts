
export interface User {
  id: string;
  name: string;
  username: string;
  email?: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  likes: number;
  coins: number;
  earnings?: number; 
  frame?: string;
  supporterLevel: number;
  supporterExp: number;
  isOnline?: boolean;
  lastNameChangeDate?: string;
  lastUsernameChangeDate?: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked' | 'restricted';
  bannedUntil?: string; 
  referralCode?: string;
  isVerified?: boolean;
  verificationStatus?: 'none' | 'pending' | 'rejected';
}

export interface ActivityItem {
  id: string;
  userId: string; // الشخص الذي سيتلقى الإشعار
  type: 'like' | 'comment' | 'follow' | 'mention';
  fromUserId: string;
  fromUserName: string;
  fromUserAvatar: string;
  timestamp: string;
  postThumb?: string;
  text?: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  timestamp: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  category: string;
  reason: string;
  idFront?: string;
  idBack?: string;
  selfieWithId?: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Post {
  id: string;
  userId: string;
  type: 'video' | 'image';
  url: string;
  thumbnail: string;
  description: string;
  musicTitle: string;
  likes: number;
  comments: number;
  shares: number;
  views: number;
  hashtags: string[];
  privacy?: 'public' | 'private' | 'followers';
}

export interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string; 
  type: 'image' | 'text';
  musicTitle?: string;
  timestamp: string;
}

export interface Gift {
  id: string;
  name: string;
  icon: string;
  price: number;
  animationType: 'static' | 'animated' | 'vehicle';
}

export interface SystemNotification {
  id: string;
  userId: string | 'all';
  title: string;
  description: string;
  timestamp: string;
  type: 'security' | 'system' | 'update' | 'reward';
}

export interface Room {
  id: string;
  title: string;
  hostId: string;
  activeMics: number;
  viewers: number;
  category: string;
  coverImage: string;
}

export interface ChatPreview {
  id: string;
  user: User;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

export enum AppRoute {
  LOGIN = 'login',
  HOME = 'home',
  LIVE = 'live',
  STORE = 'store',
  CHAT = 'chat',
  CHAT_DETAIL = 'chat-detail',
  PROFILE = 'profile',
  ADMIN = 'admin',
  ROOM_DETAIL = 'room-detail',
  EXPLORE = 'explore',
  UPLOAD = 'upload',
  SETTINGS = 'settings',
  EDIT_PROFILE = 'edit-profile',
  STORY_UPLOAD = 'story-upload',
  STORY_VIEW = 'story-view',
  FOLLOWERS = 'followers',
  ACTIVITY = 'activity',
  SYSTEM_NOTIFS = 'system-notifs',
  EARNINGS = 'earnings',
  REFERRAL = 'referral',
  VERIFICATION = 'verification',
  SUPPORTER_LEVEL = 'supporter-level'
}
