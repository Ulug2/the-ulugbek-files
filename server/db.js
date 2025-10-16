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
      time TEXT,
      description TEXT NOT NULL,
      content TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS visitor_count (
      id SERIAL PRIMARY KEY,
      count INTEGER DEFAULT 0
    );
    `)

    // Migration: Add time column if it doesn't exist (for existing databases)
    try {
        await pool.query(`
            DO $$ 
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='posts' AND column_name='time'
                ) THEN
                    ALTER TABLE posts ADD COLUMN time TEXT;
                END IF;
            END $$;
        `);
    } catch (err) {
        console.warn('Migration warning:', err.message);
    }

    const {rows} = await pool.query(`SELECT COUNT(*) FROM visitor_count`)
    if (Number(rows[0].count) === 0) {
      await pool.query(`INSERT INTO visitor_count (count) VALUES (0)`);
    }

}


