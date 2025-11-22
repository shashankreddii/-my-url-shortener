import { Pool } from 'pg';

// SQL schema for the 'links' table
/*
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
*/

let pool: Pool;

if (process.env.POSTGRES_URL) {
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  });
} else {
  // This is for local development, you might want to configure it differently
  pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'your_db_name',
    password: 'your_password',
    port: 5432,
  });
}

export default pool;
