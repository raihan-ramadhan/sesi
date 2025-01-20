'use client';

import { SignOutButton } from '@/components/auth/sign-out-button';
import { getAccountLinkStatus } from '@/lib/auth/getAccountLinkStatusServerAction';
import { getUser } from '@/lib/auth/getUserServerAction';
import { getUserRole } from '@/lib/auth/getUserRoleServerAction';
import { handleGoogleSignIn } from '@/lib/auth/googleSignInServerAction';
import { unlinkGoogleAccount } from '@/lib/auth/unlinkGoogleAccountServerAction';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export const AccountPage: React.FC = () => {
  const [isAccountLinked, setIsAccountLinked] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const { update } = useSession();

  useEffect(() => {
    const userInfo = async () => {
      const name = await getUser();
      if (name) {
        setUsername(name.name ?? '');
      }

      const role = await getUserRole();
      if (role) {
        setRole(role);
      }
    };
    const accountLinkStatus = async () => {
      try {
        const accountLinkStatus = await getAccountLinkStatus();
        setIsAccountLinked(accountLinkStatus);
      } catch (error) {
        console.error('Failed to get account link status:', error);
      }
    };
    userInfo();
    accountLinkStatus();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <a href="/admin" className="text-blue-500 hover:underline mb-4 block">
          Go to Admin Page
        </a>
        <div className="mb-4">
          <p className="text-gray-700">Role: {role}</p>
        </div>
        <div className="mb-4 text-lg font-semibold">{username}</div>
        <div className="mb-4">
          <input
            className="border border-gray-300 rounded-lg p-2 w-full"
            type="text"
            placeholder="Enter name"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <button
            className="bg-blue-500 text-white rounded-lg p-2 mt-2 w-full"
            onClick={() => update({ name: username })}
          >
            Update Name
          </button>
        </div>
        <div className="mb-4">
          <button
            className={`${
              isAccountLinked ? 'bg-red-500' : 'bg-green-500'
            } text-white rounded-lg p-2 w-full`}
            onClick={
              isAccountLinked
                ? async () => {
                    await unlinkGoogleAccount().then(() => {
                      setIsAccountLinked(false);
                    });
                  }
                : async () => {
                    await handleGoogleSignIn().then(() => {
                      setIsAccountLinked(true);
                    });
                  }
            }
          >
            {isAccountLinked
              ? 'Disconnect Google Account'
              : 'Connect Google Account'}
          </button>
        </div>
        <div>
          <SignOutButton className="bg-gray-500 text-white rounded-lg p-2 w-full" />
        </div>
      </div>
    </div>
  );
};
