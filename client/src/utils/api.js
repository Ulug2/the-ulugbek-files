const BASE = import.meta.env.VITE_API_URL || ''

async function jsonFetch(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    })
    if (!res.ok) {
        const text = await res.text().catch(() => '')
        throw new Error(text || `HTTP ${res.status}`)
    }
    if (res.status === 204) return null
    return await res.json()
}

export const api = {
    listPosts: () => jsonFetch('/api/posts'),
    getPost: (id) => jsonFetch(`/api/posts/${id}`),
    createPost: (data) => jsonFetch('/api/posts', { method: 'POST', body: JSON.stringify(data) }),
    updatePost: (id, data) => jsonFetch(`/api/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePost: (id) => jsonFetch(`/api/posts/${id}`, { method: 'DELETE' }),
}


