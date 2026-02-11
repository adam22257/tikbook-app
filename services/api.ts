
import { User } from '../types';

/**
 * TikBook API Engine (Simulated Node.js/Express/MongoDB)
 */

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  /**
   * مزامنة بيانات المستخدم مع قاعدة البيانات
   */
  syncUserToAdminList: async (user: User) => {
    const allUsers = JSON.parse(localStorage.getItem('tikbook_all_users') || '[]');
    const exists = allUsers.find((u: any) => u.id === user.id);
    if (!exists) {
      allUsers.push(user);
    } else {
      const index = allUsers.findIndex((u: any) => u.id === user.id);
      allUsers[index] = { ...allUsers[index], ...user };
    }
    localStorage.setItem('tikbook_all_users', JSON.stringify(allUsers));
  },

  /**
   * جلب كافة المستخدمين
   */
  getAllUsers: async (): Promise<User[]> => {
    await delay(200);
    return JSON.parse(localStorage.getItem('tikbook_all_users') || '[]');
  },

  /**
   * تحديث بيانات الملف الشخصي
   */
  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    const allUsers = JSON.parse(localStorage.getItem('tikbook_all_users') || '[]');
    const updatedUsers = allUsers.map((u: any) => u.id === userId ? { ...u, ...updates } : u);
    localStorage.setItem('tikbook_all_users', JSON.stringify(updatedUsers));
    
    const user = updatedUsers.find((u: any) => u.id === userId);
    if (localStorage.getItem('tikbook_user')) {
      const current = JSON.parse(localStorage.getItem('tikbook_user') || '{}');
      if (current.id === userId) {
        localStorage.setItem('tikbook_user', JSON.stringify(user));
      }
    }
    return user;
  },

  /**
   * شحن العملات
   */
  chargeCoins: async (userId: string, amount: number): Promise<User> => {
    const allUsers = JSON.parse(localStorage.getItem('tikbook_all_users') || '[]');
    const user = allUsers.find((u: any) => u.id === userId);
    if (!user) throw new Error('User not found');
    const newBalance = (user.coins || 0) + amount;
    return await api.updateProfile(userId, { coins: newBalance });
  }
};
