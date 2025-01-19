import { CircleCheck } from 'lucide-react';

const AuthSuccessPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col items-center">
          <CircleCheck className="text-green-500 text-6xl mb-4" />
          <p className="text-lg font-semibold text-center">
            {'Success! Please check your email inbox for sign in link.'}
          </p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            {
              "Didn't receive an email? To go back to the sign-in page and try again, "
            }
            <a
              href="/api/auth/signin"
              className="text-blue-500 hover:underline"
            >
              Click Here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
