'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { resendMagicLinkAction } from '@/actions/auth';
import { cn } from '@/utils/utils';
import Link from 'next/link';
import { useActionState } from 'react';
import constants from '@/utils/constants';
import useToastResult from '@/hooks/use-toast-result';

export function ResendMagicLink() {
  const initialCount = 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialCount);
  const btnId = 'sendLink';
  const searchParams = useSearchParams();
  const email = searchParams.get('email') as string;
  const { toastResHandler } = useToastResult();

  const initialState = {
    message: '',
    status: '',
  };

  const [state, formAction, pending] = useActionState(
    resendMagicLinkAction.bind(null, email),
    initialState,
  );

  useEffect(() => {
    if (pending) {
      setTimeLeft(initialCount); //start countdown again
    } else {
      if (state.status === constants('STATUS_SUCCESS')) {
        toastResHandler({
          status: constants('STATUS_SUCCESS'),
          successMessage: 'Magic link sudah dikirim lagi ke email kamu.',
        });
      } else if (state.status === 'error') {
        toastResHandler({ status: 'error' });
      }
    }

    state.status = '';
    state.message = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending]);

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
    <form action={formAction}>
      {email ? (
        <div className="text-sm text-gray-600">
          Didn&apos;t receive an email? To send the magic link again,{' '}
          <button
            type="submit"
            id={btnId}
            disabled={timeLeft !== 0 || pending}
            className={cn(
              'text-gray-400 hover:underline transition-all duration-200',
              timeLeft === 0 &&
                !pending &&
                'text-blue-500 underline cursor-pointer',
            )}
          >
            Click Here
          </button>
          {timeLeft !== 0 ? <span> {timeLeft}</span> : null}
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          Didn&apos;t receive an email? To go back to sign in page and try
          again,{' '}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Click Here
          </Link>
        </p>
      )}
    </form>
  );
}
