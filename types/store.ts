import { User } from './auth';

export type UserStore = {
  user: User;
  setUser: (updates: Partial<User>) => void;
  initializer: (initialData: User) => void;
};
