import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/utils/supabase/server';
import { tableUserProfileName } from '@/utils/constants';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.log('Error fetching user data', userError.message);
        return NextResponse.redirect(`${origin}/error`);
      }

      const { data: existingUser } = await supabase
        .from(tableUserProfileName)
        .select('*')
        .eq('email', data.user?.email)
        .limit(1)
        .single();

      if (!existingUser) {
        const payload = {
          email: data?.user?.email,
        };

        // create user profiles
        const { error: insertError } = await supabase
          .from(tableUserProfileName)
          .insert(payload);

        if (insertError) {
          console.log('Error inserting user data', insertError.message);
          return NextResponse.redirect(`${origin}/auth-error`);
        }
      }

      if (!existingUser?.userName || !existingUser?.avatarUrl) {
        // update user that not have userName and avatarUrl bc they signed up in with email
        let payload: Record<string, any> = {};

        if (!existingUser?.userName)
          payload.userName = data?.user?.user_metadata?.name ?? '';
        if (!existingUser?.avatarUrl)
          payload.avatarUrl = data?.user?.user_metadata?.avatar_url ?? '';

        if (Object.keys(payload).length > 0) {
          const { error: updateUsernameError } = await supabase
            .from(tableUserProfileName)
            .update(payload)
            .eq('email', data.user?.email);

          if (updateUsernameError) {
            console.log(
              'Error updating user profiles',
              updateUsernameError.message,
            );
            return NextResponse.redirect(`${origin}/auth-error`);
          }
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host'); // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth-error`);
}
