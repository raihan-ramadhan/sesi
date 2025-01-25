'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useTransition, useState } from 'react';
import { MailOpen } from 'lucide-react';
// import Link from 'next/link';
import { signInWithGoogle } from '@/actions/auth';

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'form'>) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({ email: '' as string });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault(); // Prevents the form from submitting and reloading the page, allowing us to handle the submission in TypeScript.
    try {
      startTransition(async () => {
        // await handleEmailSignIn(formData.email);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleGoogleLogin = () => {
    startTransition(async () => {
      await signInWithGoogle();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Masuk ke akun Anda</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Masukkan email Anda untuk menerima magic link
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            maxLength={320}
            placeholder="Email Address"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ email: event.target.value })
            }
            disabled={isPending}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          <MailOpen /> Login with Email
        </Button>
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Atau lanjut dengan
          </span>
        </div>
        <Button
          variant="outline"
          onClick={handleGoogleLogin}
          className="w-full"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="w-full h-full"
          >
            <path
              d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16"
              fill="#00ac47"
            />
            <path
              d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16"
              fill="#4285f4"
            />
            <path
              d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z"
              fill="#ffba00"
            />
            <polygon
              fill="#2ab2db"
              points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374"
            />
            <path
              d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z"
              fill="#ea4435"
            />
            <polygon
              fill="#2ab2db"
              points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626"
            />
            <path
              d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z"
              fill="#4285f4"
            />
          </svg>
          Masuk dengan Google
        </Button>
      </div>

      {/* TODO : ADD /auth/terms-of-service-and-privacy-policy.tsx page */}
      {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our{' '}
        <Link href="/auth/terms-of-service-and-privacy-policy">Terms of Service</Link> and{' '}
        <Link href="/auth/terms-of-service-and-privacy-policy">Privacy Policy</Link>.
      </div> */}
    </form>
  );
}
