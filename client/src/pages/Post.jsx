import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function PostForm({ initial, onCancel, onSave }) {
    const [title, setTitle] = useState(initial?.title || '')
    const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10))
    const [time, setTime] = useState(initial?.time || new Date().toTimeString().slice(0, 5))
    const [description, setDescription] = useState(initial?.description || '')
    const [content, setContent] = useState(initial?.content || '')

    function handleSubmit(e) {
        e.preventDefault()
        onSave({ id: initial?.id, title, date, time, description, content })
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
                <label>Time<br />
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} required />
                </label>
            </div>
            <div style={{ marginBottom: 8 }}>
                <label>Short Description<br />
                    <input value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%' }} required />
                </label>
            </div>
            <div style={{ marginBottom: 8 }}>
                <label>Content<br />
                    <textarea value={content} onChange={e => setContent(e.target.value)} rows={10} style={{ width: '100%' }} required />
                </label>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit">Save</button>
                <button type="button" onClick={onCancel}>Cancel</button>
            </div>
        </form>
    )
}

export default function Post({ posts, isAdmin, onUpdate, onDelete }) {
    const { id } = useParams()
    const navigate = useNavigate()
    const post = useMemo(() => posts.find(p => p.id === id), [posts, id])
    const [editing, setEditing] = useState(false)

    if (!post) {
        return <div>Post not found.</div>
    }

    return (
        <div>
            {!editing ? (
                <div>
                    <h2 style={{ margin: '6px 0' }}>{post.title}</h2>
                    <div style={{ color: '#555', fontSize: 12, marginBottom: 6 }}>
                        {post.date} {post.time && `at ${post.time}`}
                    </div>
                    <div style={{ marginBottom: 12, fontStyle: 'italic' }}>{post.description}</div>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{post.content}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <button onClick={() => navigate(-1)}>Back</button>
                        {isAdmin && (
                            <>
                                <button onClick={() => setEditing(true)}>Edit</button>
                                <button onClick={() => { onDelete(post.id); navigate('/') }}>Delete</button>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <PostForm
                    initial={post}
                    onCancel={() => setEditing(false)}
                    onSave={(p) => { onUpdate(p); setEditing(false) }}
                />
            )}
        </div>
    )
}


