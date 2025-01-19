'use server';

import { pool } from '@/lib/postgres';

export const clearStaleTokens = async () => {
  try {
    await pool.query('DELETE FROM verification_token WHERE expires < NOW();');
  } catch (error) {
    throw error;
  }
};
