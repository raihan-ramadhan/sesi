'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
// export async function signUp(formData: FormData) {
//   const supabase = await createClient();

//   const credentials = {
//     username: formData.get('username') as string,
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   };

//   const { error, data } = await supabase.auth.signUp({
//     email: credentials.email,
//     password: credentials.password,
//     options: {
//       data: {
//         username: credentials.username,
//       },
//     },
//   });

//   if (error) {
//     return {
//       status: error.message,
//       user: null,
//     };
//   } else if (data?.user?.identities?.length === 0) {
//     return {
//       status: 'User with this email already exist, please login',
//       user: null,
//     };
//   }

//   revalidatePath('/', 'layout');
//   return { status: 'success', user: data.user };
// }

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const credentials = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error, data } = await supabase.auth.signInWithPassword(credentials);

  if (error) {
    return {
      status: error.message,
      user: null,
    };
  }

  const { data: existingUser } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('email', credentials?.email)
    .limit(1)
    .single();

  if (!existingUser) {
    const { error: inserError } = await supabase.from('user_profiles').insert({
      email: data?.user?.email,
      username: data?.user?.user_metadata?.username,
    });

    if (inserError) {
      return {
        status: inserError?.message,
        user: null,
      };
    }
  }

  revalidatePath('/', 'layout');
  return { status: 'success', user: data.user };
}

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
    status: 'success',
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

// export async function forgotPassword(formData: FormData) {
//   const supabase = await createClient();
//   const origin = (await headers()).get('origin');

//   const { error } = await supabase.auth.resetPasswordForEmail(
//     formData.get('email') as string,
//     {
//       redirectTo: `${origin}/reset-password`,
//     },
//   );

//   if (error) {
//     return { status: error?.message };
//   }

//   return { status: 'success' };
// }

// export async function resetPassword(formData: FormData, code: string) {
//   const supabase = await createClient();
//   const { error: codeError } = await supabase.auth.exchangeCodeForSession(code);

//   if (codeError) {
//     return { status: codeError?.message };
//   }

//   const { error } = await supabase.auth.updateUser({
//     password: formData.get('password') as string,
//   });

//   if (error) {
//     return { status: error?.message };
//   }

//   return { status: 'success' };
// }

const schemaSendMagicLink = z.object({
  email: z.string({
    invalid_type_error: 'Invalid Email',
  }),
});

export async function sendMagicLink(formData: FormData) {
  const validatedFields = schemaSendMagicLink.safeParse({
    email: formData.get('email'),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return redirect(
      `/auth-error?message=${validatedFields.error.flatten().fieldErrors}`,
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

export async function resendMagicLinkAction(email: string) {
  if (!email) return { status: 'error' };

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({ email });

  if (error) {
    return { status: 'error', message: error.message };
  }
  return { status: 'success' };
}
