'use server';

import { createClient } from '@/utils/supabase/server';
import { getUserSession } from './auth';
import { z } from 'zod';
import { User, GENDER_VALUES } from '@/types/auth';
import { getUserProfiles } from './user-profiles';
import { tableUserProfileName } from '@/utils/constants';

const schemaAccount = z.object({
  userName: z
    .string({
      invalid_type_error: 'Invalid Username',
    })
    .or(z.literal('')),
  address: z
    .string({
      invalid_type_error: 'Invalid BannerUrl',
    })
    .or(z.literal('')),
  gender: z
    .enum(GENDER_VALUES, {
      invalid_type_error: 'Invalid Gender',
    })
    .or(z.literal('')),
});

export async function getAccountData() {
  const session = await getUserSession();
  // return not authenticated user
  if (!session) {
    return { status: 'error', message: 'User is not authenticated' };
  }

  const userProfiles = await getUserProfiles(session?.user.email as string);
  if (userProfiles.status !== 'success') {
    return { status: 'error', message: userProfiles.message };
  }

  return { status: 'success', data: userProfiles.data };
}

export async function updateAccountData({
  formData,
  oldData,
}: {
  formData: FormData;
  oldData: User;
}) {
  const validatedFields = schemaAccount.safeParse({
    userName: formData.get('userName'),
    gender: formData.get('gender'),
    address: formData.get('address'),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: 'error',
      message: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { data: validatedData } = validatedFields;

  let payload = {} as User;

  if (validatedData.userName !== oldData.userName)
    payload.userName = validatedData.userName;
  if (validatedData.address !== oldData.address)
    payload.address = validatedData.address;
  if (validatedData.gender !== oldData.gender)
    payload.gender = validatedData.gender;

  if (Object.keys(payload).length === 0) {
    return { status: 'error', message: 'Tolong lakukan sebuah perubahan' };
  }

  const isAuthenticated = await getUserSession();
  // return not authenticated user
  if (!isAuthenticated) {
    return { status: 'error', message: 'User is not authenticated' };
  }

  const supabase = await createClient();
  const { error: updateError, data } = await supabase
    .from(tableUserProfileName)
    .update(payload)
    .eq('email', isAuthenticated.user.email)
    .select()
    .single();

  if (updateError) {
    return { status: 'error', message: updateError.message };
  }

  return { status: 'success', data };
}
