import Link from 'next/link';
import { TriangleAlert } from 'lucide-react';

const AuthErrorPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="flex items-center space-x-2 mb-4">
          <TriangleAlert className="text-red-500 w-6 h-6" />
          <p className="text-red-500 font-semibold">
            {'Oops, something went wrong when signing.'}
          </p>
        </div>
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
};

export default AuthErrorPage;
