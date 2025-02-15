import { headers } from 'next/headers';

// to be able to use this func the project must set x-current-path in supabaseResponse.headers
export const getPathname = async () => {
  const headerList = await headers();
  const pathname = headerList.get('x-current-path') || '/';
  return pathname;
};
