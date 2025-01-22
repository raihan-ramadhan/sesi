export type Role = 'USER' | 'ADMIN' | 'OWNER';
export type Gender = 'PRIA' | 'WANITA' | 'MEMILIH_TIDAK_UNTUK_DIKATAKAN';

export type User = {
  name: string | undefined | null;
  email: string;
  image: string | undefined | null;
  banner: string;
  phoneNumber: string;
  gender?: Gender | null;
  address: string;
};
