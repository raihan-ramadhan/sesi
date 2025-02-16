import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import constants from '@/utils/constants';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/dashboard';

  if (token_hash && type) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error) {
      // create user_profiles
      const { data: existingUser } = await supabase
        .from(constants('TABLE_USER_PROFILE_NAME'))
        .select('*')
        .eq('email', data.user?.email)
        .limit(1)
        .single();

      if (!existingUser) {
        const { error: dbError } = await supabase
          .from(constants('TABLE_USER_PROFILE_NAME'))
          .insert({
            email: data?.user?.email,
          });

        if (dbError) {
          console.log('Error inserting user data', dbError.message);
          return NextResponse.redirect(`${origin}/auth-error`);
        }
      }
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }

    redirect(`/auth-error?message=${error.message}`);
  }

  // redirect the user to an error page with some instructions
  redirect(`/auth-error?message=Terjadi sebuah kesalahan`);
}
