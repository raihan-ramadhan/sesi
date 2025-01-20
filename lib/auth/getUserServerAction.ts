'use server';

import { auth } from '@/lib/auth/authConfig';
import { User } from '@/types/auth';

export const getUser = async (): Promise<User | undefined> => {
  const session = await auth();
  if (session && session.user) {
    return {
      name: session.user.name,
      email: session.user.email as string,
      image: session.user.image,
    };
  }
};
