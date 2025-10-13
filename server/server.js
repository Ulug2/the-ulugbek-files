// Load .env variables in local/dev environments
import 'dotenv/config';
import express from "express";
import cors from "cors";
import { createPool, ensureSchema } from "./db.js";

// Basic Express app with JSON parsing and CORS enabled
const app = express();
app.use(cors());
app.use(express.json());

// Create a pg pool if DATABASE_URL is provided
const pool = createPool();
if (pool) {
    ensureSchema(pool).catch((err) => {
        console.error("Failed to ensure schema", err);
    });
}

// In-memory fallback when no DB configured
let posts = [
    {
        id: '1',
        title: 'Welcome to My Retro Blog',
        date: new Date().toISOString().slice(0, 10),
        description: 'A humble start with a classic web vibe.',
        content: 'This is my first post. Expect simple layouts, blue links, and good old-fashioned text.\n\nThanks for visiting!'
    },
];

// Health/root
app.get("/", (req, res) => {
    res.send("OK");
});

// CRUD routes
app.get('/api/posts', async (req, res) => {
    try {
        if (pool) {
            const { rows } = await pool.query('SELECT id, title, date, description, content FROM posts ORDER BY date DESC NULLS LAST, id DESC');
            return res.json(rows);
        }
        res.json(posts);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/posts/:id', async (req, res) => {
    try {
        if (pool) {
            const { rows } = await pool.query('SELECT id, title, date, description, content FROM posts WHERE id = $1', [req.params.id]);
            if (!rows[0]) return res.status(404).json({ error: 'Not found' });
            return res.json(rows[0]);
        }
        const post = posts.find(p => p.id === req.params.id);
        if (!post) return res.status(404).json({ error: 'Not found' });
        res.json(post);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/posts', async (req, res) => {
    try {
        const { title, date, description, content } = req.body || {};
        if (!title || !description || !content) {
            return res.status(400).json({ error: 'Missing fields' });
        }
        const id = String(Date.now());
        const finalDate = date || new Date().toISOString().slice(0, 10);
        if (pool) {
            const { rows } = await pool.query(
                'INSERT INTO posts (id, title, date, description, content) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, date, description, content',
                [id, title, finalDate, description, content]
            );
            return res.status(201).json(rows[0]);
        }
        const newPost = { id, title, date: finalDate, description, content };
        posts.unshift(newPost);
        res.status(201).json(newPost);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

app.put('/api/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, description, content } = req.body || {};
        if (pool) {
            const { rows } = await pool.query(
                'UPDATE posts SET title = $2, date = $3, description = $4, content = $5 WHERE id = $1 RETURNING id, title, date, description, content',
                [id, title, date, description, content]
            );
            if (!rows[0]) return res.status(404).json({ error: 'Not found' });
            return res.json(rows[0]);
        }
        const idx = posts.findIndex(p => p.id === id);
        if (idx === -1) return res.status(404).json({ error: 'Not found' });
        const updated = { ...posts[idx], title, date, description, content };
        posts[idx] = updated;
        res.json(updated);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

app.delete('/api/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (pool) {
            const result = await pool.query('DELETE FROM posts WHERE id = $1', [id]);
            if (result.rowCount === 0) return res.status(404).json({ error: 'Not found' });
            return res.status(204).end();
        }
        const before = posts.length;
        posts = posts.filter(p => p.id !== id);
        if (posts.length === before) return res.status(404).json({ error: 'Not found' });
        res.status(204).end();
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});