'use client';

import Link from 'next/link';
import React from 'react';

export const SignInButton = () => {
  return (
    <Link
      href="/auth/sign-in"
      className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
    >
      Login
    </Link>
  );
};
