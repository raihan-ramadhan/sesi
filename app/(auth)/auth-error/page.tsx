import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <div className="bg-white rounded-lg shadow-lg text-center p-4">
        <div className="flex items-center space-x-2">
          <TriangleAlert className="text-red-500 w-6 h-6" />
          <p className="text-red-500 font-semibold">
            {'Oops, something went wrong when signing.'}
          </p>
        </div>
        <p className="text-red-500 font-semibold">{message}</p>
        <div>
          <p className="text-gray-700">
            {'To go back to the sign in page, '}
            <Link
              href="/api/auth/signin"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Click Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
