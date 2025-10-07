// Placeholder PostgreSQL setup using pg. Not used yet; for future migration.
import pkg from 'pg'
const { Pool } = pkg

export function createPool() {
    if (!process.env.DATABASE_URL) return null
    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL ? { rejectUnauthorized: false } : false })
    return pool
}

export async function ensureSchema(pool) {
    if (!pool) return
    await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT,
      description TEXT NOT NULL,
      content TEXT NOT NULL
    );
  `)
}


