export type User = {
  name: string | undefined | null;
  email: string;
  image: string | undefined | null;
};

export type Role = 'USER' | 'ADMIN' | 'OWNER';
