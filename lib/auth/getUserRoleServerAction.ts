'use server';

import { pool } from '@/lib/postgres';
import { auth } from './authConfig';
import { Role } from '@/types/auth';
// Get the role from the postgres database based on the UUID in the users table
export const getUserRole = async (): Promise<Role> => {
  const session = await auth();
  if (session && session.user) {
    const uuid = session.user.id;

    // Sanitize input
    const uuidRegExp: RegExp =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
    if (typeof uuid !== 'string' || !uuidRegExp.test(uuid)) {
      throw new Error('Invalid UUID');
    }

    const { rows } = await pool.query('SELECT role FROM users WHERE id = $1', [
      uuid,
    ]);

    if (!rows[0]?.role) {
      throw new Error('Role Not Found!');
    }
    return rows[0].role as Role;
  }
  throw new Error('User not authenticated');
};
