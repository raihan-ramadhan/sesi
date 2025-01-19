import { SignInButton } from '@/components/auth/sign-in-button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{' '}
          <Link className="text-blue-600" href="/">
            SESI
          </Link>
        </h1>
        <p className="mt-3 text-2xl">Jago nya Seleksi Kompetensi</p>
        <div className="mt-6 flex justify-center">
          <SignInButton />
        </div>
      </main>
    </div>
  );
}
