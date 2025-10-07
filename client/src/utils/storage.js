const STORAGE_KEY = 'blog_posts_v1'

const seed = [
    {
        id: '1',
        title: 'Welcome to My Retro Blog',
        date: new Date().toISOString().slice(0, 10),
        description: 'A humble start with a classic web vibe.',
        content: 'This is my first post. Expect simple layouts, blue links, and good old-fashioned text.\n\nThanks for visiting!'
    },
]

export function getPostsFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return seed
        const parsed = JSON.parse(raw)
        if (!Array.isArray(parsed)) return seed
        return parsed
    } catch {
        return seed
    }
}

export function savePostsToStorage(posts) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
    } catch {
        // ignore
    }
}


