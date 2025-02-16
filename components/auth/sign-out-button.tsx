'use client';

export const SignOutButton = (props: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <button
      className={`cursor-pointer px-4 py-2 bg-blue-500 text-white border-none rounded transition-colors duration-300 hover:bg-blue-700 ${props.className}`}
      onClick={() => {}}
    >
      {props.children || 'Sign Out'}
    </button>
  );
};
