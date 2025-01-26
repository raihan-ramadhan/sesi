'use client';

import { sendMagicLink } from '@/actions/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';

export function SendLinkAgain() {
  const [isPending, startTransition] = useTransition();
  const [timeLeft, setTimeLeft] = useState<number>(60); // Countdown starting from 10 seconds
  const btnId = 'sendLink';
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevents the form from submitting and reloading the page, allowing us to handle the submission in TypeScript.
    setTimeLeft(60); //start countdown again

    if (email) {
      startTransition(async () => {
        const response = await sendMagicLink(email);

        if (response.status === 'success') {
          toast({
            title: 'Sukses!.',
            description: 'Magic link sudah dikirim lagi ke email kamu.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Uh oh! Terjadi kesalahan.',
            description: 'Ada kesalahan dengan permintaan request kamu.',
          });
        }
      });
    }
  };

  useEffect(() => {
    if (timeLeft === 0) return;
    // Stop when the countdown hits 0

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000); // Update every second

    // Cleanup function to clear the timer if the component unmounts
    return () => clearInterval(timer);
  }, [timeLeft]);

  return (
    <form action="" onSubmit={handleSubmit}>
      {email ? (
        <div className="text-sm text-gray-600">
          Didn't receive an email? To send the magic link again,{' '}
          <button
            type="submit"
            id={btnId}
            disabled={timeLeft !== 0 || isPending}
            className={cn(
              'text-gray-400 hover:underline transition-all duration-200',
              timeLeft === 0 && 'text-blue-500 underline cursor-pointer',
            )}
          >
            Click Here
          </button>
          {timeLeft !== 0 ? <span> {timeLeft}</span> : null}
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          Didn't receive an email? To go back to sign in page and try again,{' '}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Click Here
          </Link>
        </p>
      )}
    </form>
  );
}
