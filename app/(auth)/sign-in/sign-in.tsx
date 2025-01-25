import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { GradientOverlay } from '@/components/gradient-overlay';

export function SignInPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Image
                placeholder="empty"
                src="/sesi.svg"
                width={14}
                height={14}
                alt="Logo of sesi - seleksi kompetensi"
                className="size-3.5 fill-white"
              />
            </div>
            Sesi.
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          placeholder="empty"
          src="/bkn-office.jpg"
          width={500}
          height={500}
          alt="Picture of BKN Office"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale bg-secondary-forground"
        />
        <GradientOverlay />
      </div>
    </div>
  );
}
