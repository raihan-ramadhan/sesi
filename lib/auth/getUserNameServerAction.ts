'use server';

import { auth } from '@/lib/auth/authConfig';

export const getUserName = async (): Promise<string | undefined> => {
  const session = await auth();
  if (session && session.user?.name) {
    return session.user.name;
  }
};
