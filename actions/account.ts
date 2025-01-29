'use server';

import { createClient } from '@/utils/supabase/server';
import { getUserSession } from './auth';
import { z } from 'zod';
import { User, GENDER_VALUES, SessionUser, Userprofiles } from '@/types/auth';
import { getUserProfiles } from './user-profiles';

const schemaAccount = z.object({
  username: z
    .string({
      invalid_type_error: 'Invalid Username',
    })
    .or(z.literal('')),
  address: z
    .string({
      invalid_type_error: 'Invalid BannerUrl',
    })
    .nullable()
    .optional()
    .or(z.literal('')),
  gender: z
    .enum(GENDER_VALUES, {
      invalid_type_error: 'Invalid Gender',
    })
    .nullable()
    .optional()
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

  const accountData: User = {
    email: session?.user.email as string,
    username: session?.user.user_metadata?.name,
    avatarUrl: session?.user.user_metadata?.avatar_url,
    address: userProfiles.data?.address as string,
    bannerUrl: userProfiles.data?.bannerUrl as string,
    gender: userProfiles.data?.gender,
  };

  return { status: 'success', data: accountData };
}

export async function updateAccountData({
  formData,
  oldData,
}: {
  formData: FormData;
  oldData: User;
}) {
  const validatedFields = schemaAccount.safeParse({
    username: formData.get('username'),
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

  const isAuthenticated = await getUserSession();
  // return not authenticated user
  if (!isAuthenticated) {
    return { status: 'error', message: 'User is not authenticated' };
  }

  const supabase = await createClient();
  const { data } = validatedFields;

  // Check changed data to avoid redundant request to DB
  if (oldData.username !== data.username) {
    const { error: updateError, data: updatedUser } =
      await supabase.auth.updateUser({ data: { name: data.username } });

    if (updateError) {
      return { status: 'error', message: updateError.message };
    }

    const newAccountData: User = {
      ...oldData,
      ...{
        email: updatedUser?.user?.email as string,
        username: updatedUser?.user?.user_metadata?.name,
        avatarUrl: updatedUser?.user?.user_metadata?.avatar_url,
      },
    };

    return { status: 'success', data: newAccountData };
  }

  // Check changed data to avoid redundant request to DB
  if (oldData.address !== data.address || oldData.gender !== data.gender) {
    const { error: updateError, data: updatedUser } = await supabase
      .from('user_profiles')
      .update({ address: data.address, gender: data.gender })
      .eq('email', isAuthenticated.user.email)
      .select()
      .single();

    if (updateError) {
      return { status: 'error', message: updateError.message };
    }

    const newAccountData: User = {
      ...oldData,
      ...{
        address: updatedUser?.address,
        gender: updatedUser?.gender,
      },
    };

    return { status: 'success', data: newAccountData };
  }

  return { status: 'error', message: 'Something wrong on your params data' };
}

export async function uploadAvatarUrl() {}
export async function uploadBannerUrl() {}
