import React from 'react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const ComingSoonPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) => {
  const { from } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100">
      <Link href="/dashboard" className="flex items-center gap-2 font-medium">
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
      <Image
        src="/coming-soon.svg"
        alt="Coming Soon Illustration"
        height={380}
        width={380}
        priority
      />
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-blue-800">Coming Soon</h1>
        <Separator className="my-3 bg-primary " />
        <p className="mt-3 text-base text-blue-600">
          We are currently working on{' '}
          {from
            ?.replace(/-/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase()) ?? 'This'}{' '}
          page.
        </p>
        <p className="text-lbase text-blue-600">
          We'll be launching soon, Stay Tuned!
        </p>
      </div>
    </div>
  );
};

export default ComingSoonPage;
