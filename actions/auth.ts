'use server';

import { ActionResponse } from '@/types/global';
import constants from '@/utils/constants';
import { createClient } from '@/utils/supabase/server';
import { logErrorMessages } from '@/utils/utils';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect(`/auth-error?message=${error.message}`);
  }

  revalidatePath('/', 'layout');
  redirect('/sign-in');
}

export async function getUserSession() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return null;
  }

  return {
    status: constants('STATUS_SUCCESS'),
    user: data.user,
  };
}

export async function signInWithGoogle() {
  const origin = (await headers()).get('origin');
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/auth-error?message=${error.message}`);
  } else if (data.url) {
    return redirect(data.url);
  }
}

const schemaSendMagicLink = z.object({
  email: z
    .string({
      invalid_type_error: 'Invalid Email',
    })
    .min(1, {
      message: 'Email is required.',
    }),
});

export async function sendMagicLink(formData: FormData) {
  const validatedFields = schemaSendMagicLink.safeParse({
    email: formData.get('email'),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return redirect(
      `/auth-error?message=${logErrorMessages(
        validatedFields.error.flatten().fieldErrors as {
          string: string[];
        },
      )}`,
    );
  }

  const supabase = await createClient();
  const email = formData?.get('email') as string;

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    return redirect(`/auth-error?message=${error.message}`);
  }
  return redirect(`/auth-success?email=${formData.get('email')}`);
}

export async function resendMagicLinkAction(
  email: string,
): Promise<ActionResponse> {
  if (!email) return { status: 'error', message: null };

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    return { status: 'error', message: error.message };
  }
  return { status: constants('STATUS_SUCCESS'), message: null };
}
