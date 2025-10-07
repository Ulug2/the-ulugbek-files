import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

function PostForm({ initial, onCancel, onSave }) {
    const [title, setTitle] = useState(initial?.title || '')
    const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10))
    const [description, setDescription] = useState(initial?.description || '')
    const [content, setContent] = useState(initial?.content || '')

    function handleSubmit(e) {
        e.preventDefault()
        const payload = { id: initial?.id, title, date, description, content }
        onSave(payload)
    }

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: 12, marginBottom: 12 }}>
            <div style={{ marginBottom: 8 }}>
                <label>Title<br />
                    <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%' }} required />
                </label>
            </div>
            <div style={{ marginBottom: 8 }}>
                <label>Date<br />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </label>
            </div>
            <div style={{ marginBottom: 8 }}>
                <label>Short Description<br />
                    <input value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%' }} required />
                </label>
            </div>
            <div style={{ marginBottom: 8 }}>
                <label>Content<br />
                    <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} style={{ width: '100%' }} required />
                </label>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    )
}

export default function Home({ posts, isAdmin, onCreate, onUpdate, onDelete }) {
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const sortedPosts = useMemo(() => {
        return [...posts].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    }, [posts])

    function startEdit(id) {
        setEditingId(id)
        setShowForm(false)
    }

    function cancelEdit() {
        setEditingId(null)
    }

    return (
        <div>
            {isAdmin && (
                <div style={{ marginBottom: 12 }}>
                    {!showForm && editingId == null && (
                        <button onClick={() => setShowForm(true)}>New Post</button>
                    )}
                    {showForm && (
                        <PostForm
                            onCancel={() => setShowForm(false)}
                            onSave={(p) => { onCreate(p); setShowForm(false) }}
                        />
                    )}
                </div>
            )}

            <div>
                {sortedPosts.length === 0 && (
                    <div>No posts yet.</div>
                )}
                {sortedPosts.map(post => (
                    <div key={post.id} style={{ borderTop: '1px solid #ddd', paddingTop: 12, marginTop: 12 }}>
                        {editingId === post.id ? (
                            <PostForm
                                initial={post}
                                onCancel={cancelEdit}
                                onSave={(p) => { onUpdate(p); cancelEdit() }}
                            />
                        ) : (
                            <div>
                                <h3 style={{ margin: '4px 0' }}>
                                    <Link to={`/post/${post.id}`}>{post.title}</Link>
                                </h3>
                                <div style={{ color: '#555', fontSize: 12, marginBottom: 6 }}>{post.date}</div>
                                <div style={{ marginBottom: 8 }}>{post.description}</div>
                                {isAdmin && (
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <button onClick={() => startEdit(post.id)}>Edit</button>
                                        <button onClick={() => onDelete(post.id)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}


