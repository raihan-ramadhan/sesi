'use server';

import { createClient } from '@/utils/supabase/server';
import { getUserSession } from './auth';
import { User } from '@/types/auth';
import constants from '@/utils/constants';

export async function getUserProfiles(email: string) {
  const isAuthenticated = await getUserSession();
  // return not authenticated user
  if (!isAuthenticated) {
    return { status: 'error', message: 'User is not authenticated' };
  }

  const supabase = await createClient();

  const { data, error, status } = await supabase
    .from(constants('TABLE_USER_PROFILE_NAME'))
    .select('*')
    .eq('email', email)
    .limit(1)
    .single();

  if (error) {
    return { status, message: error.message };
  }

  return { status: 'success', data: data as User };
}
