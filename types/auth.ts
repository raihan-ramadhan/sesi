export type Role = 'USER' | 'ADMIN' | 'OWNER';

export const GENDER_VALUES = [
  'PRIA',
  'WANITA',
  'TIDAK_INGIN_MENYEBUTKAN',
  '',
] as const;

export type Gender = (typeof GENDER_VALUES)[number];

export type User = {
  bannerUrl: string;
  address: string;
  gender: Gender;
  userName: string;
  email: string;
  avatarUrl: string;
};
