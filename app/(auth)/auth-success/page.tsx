import { CircleCheck } from 'lucide-react';
import { ResendMagicLink } from './ResendMagicLink';

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
          <ResendMagicLink />
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
