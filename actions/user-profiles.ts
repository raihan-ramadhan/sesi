'use server';

import { createClient } from '@/utils/supabase/server';
import { getUserSession } from './auth';
import { Userprofiles } from '@/types/auth';

export async function getUserProfiles(email: string) {
  const isAuthenticated = await getUserSession();
  // return not authenticated user
  if (!isAuthenticated) {
    return { status: 'error', message: 'User is not authenticated' };
  }

  const supabase = await createClient();

  const { data, error, status } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', email)
    .limit(1)
    .single();

  if (error) {
    return { status, message: error.message };
  }

  return { status: 'success', data: data as Userprofiles };
}
