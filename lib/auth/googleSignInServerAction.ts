'use server';

import { signIn } from '@/lib/auth/authConfig';

export const handleGoogleSignIn = async () => {
  try {
    await signIn('google', { redirectTo: '/dashboard' });
  } catch (error) {
    throw error;
  }
};
