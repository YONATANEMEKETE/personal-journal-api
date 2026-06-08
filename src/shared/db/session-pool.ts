import pg from 'pg';
import 'dotenv/config';
import { configs } from '../configs/env.js';

export const sessionPool = new pg.Pool({
  connectionString: configs.DATABASE_URL,
  max: 5,
});
