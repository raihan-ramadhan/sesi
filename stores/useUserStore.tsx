import { User } from '@/types/auth';
import { UserStore } from '@/types/store';
import { create } from 'zustand';

const blankUser = {} as User;

export const useUserStore = create<UserStore>((set) => ({
  user: blankUser,
  initializer: (initialData: User) => set({ user: initialData }),
  setUser: (updates: Partial<User>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updates } : blankUser,
    })),
}));
