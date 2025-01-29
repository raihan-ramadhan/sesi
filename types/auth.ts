export type Role = 'USER' | 'ADMIN' | 'OWNER';

export const GENDER_VALUES = [
  'PRIA',
  'WANITA',
  'TIDAK_INGIN_MENYEBUTKAN',
  '',
] as const;

export type Gender = (typeof GENDER_VALUES)[number];

export type SessionUser = {
  username?: string | null;
  email: string;
  avatarUrl: string;
};

export type Userprofiles = {
  bannerUrl: string;
  address: string;
  gender?: Gender | null;
};

export type User = SessionUser & Userprofiles;
