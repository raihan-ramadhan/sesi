export type Role = 'USER' | 'ADMIN' | 'OWNER';
export type Gender = 'PRIA' | 'WANITA' | 'TIDAK_INGIN_MENYEBUTKAN';

export type User = {
  name: string | undefined | null;
  email: string;
  avatarUrl: string | undefined | null;
};
