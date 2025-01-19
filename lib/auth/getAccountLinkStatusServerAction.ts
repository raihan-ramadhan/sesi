'use server';

import { auth } from '@/lib/auth/authConfig';
import { pool } from '@/lib/postgres';

export const getAccountLinkStatus = async () => {
  // Check if the user is authenticated
  const session = await auth();
  if (!session) {
    throw new Error('Unauthorized');
  }

  if (!session.user?.id) throw new Error('No user id found in session');

  const uuid: string = session.user.id;

  // Sanitize input
  const uuidRegExp: RegExp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
  if (typeof uuid !== 'string' || !uuidRegExp.test(uuid)) {
    throw new Error('Invalid UUID');
  }

  // Check if the user has a Google account linked
  try {
    const result = await pool.query(
      'SELECT EXISTS (SELECT 1 FROM accounts WHERE provider = \'google\' AND "userId" = $1)',
      [uuid],
    );

    if (!result.rows[0].exists) {
      return false;
    }
  } catch (error) {
    console.error('Failed to check if user has Google account linked:', error);
  }

  return true;
};
