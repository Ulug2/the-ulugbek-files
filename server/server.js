import express from "express";
import cors from "cors";

// Basic Express app with JSON parsing and CORS enabled
const app = express();
app.use(cors());
app.use(express.json());

// In-memory posts (replace with PostgreSQL later)
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
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

app.get('/api/posts/:id', (req, res) => {
    const post = posts.find(p => p.id === req.params.id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    res.json(post);
});

app.post('/api/posts', (req, res) => {
    const { title, date, description, content } = req.body || {};
    if (!title || !description || !content) {
        return res.status(400).json({ error: 'Missing fields' });
    }
    const newPost = {
        id: String(Date.now()),
        title,
        date: date || new Date().toISOString().slice(0, 10),
        description,
        content,
    };
    posts.unshift(newPost);
    res.status(201).json(newPost);
});

app.put('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const idx = posts.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const { title, date, description, content } = req.body || {};
    const updated = { ...posts[idx], title, date, description, content };
    posts[idx] = updated;
    res.json(updated);
});

app.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const before = posts.length;
    posts = posts.filter(p => p.id !== id);
    if (posts.length === before) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});