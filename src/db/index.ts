import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// ssl: 'require' is needed for cloud-hosted Postgres (Neon, Supabase, Railway, etc.)
// For local Docker Postgres, ssl is ignored because the server doesn't support it
const client = postgres(connectionString, {
  ssl: connectionString.includes('localhost') || connectionString.includes('127.0.0.1')
    ? false
    : 'require',
  connect_timeout: 15,
});
export const db = drizzle(client, { schema });
