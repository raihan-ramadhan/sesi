'use server';

import { auth } from '@/lib/auth/authConfig';
import { Session } from 'next-auth';

export const getUser = async (): Promise<Session['user'] | undefined> => {
  const session = await auth();

  if (session && session.user) {
    return {
      name: session.user.name,
      email: session.user.email as string,
      image: session.user.image,
    };
  }
};
