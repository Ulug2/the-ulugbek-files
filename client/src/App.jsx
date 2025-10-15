import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'

import Home from './pages/Home.jsx'
import Post from './pages/Post.jsx'
import AdminModal from './components/AdminModal.jsx'
import VisitCounter from './components/VisitCounter.jsx'
import { getPostsFromStorage, savePostsToStorage } from './utils/storage.js'
import { api } from './utils/api.js'

const TEMP_ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

function App() {
  const [posts, setPosts] = useState(() => getPostsFromStorage())
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const location = useLocation()

  useEffect(() => {
    savePostsToStorage(posts)
  }, [posts])

  // Attempt to load from API on mount; fallback to localStorage seed
  useEffect(() => {
    let cancelled = false
    api.listPosts()
      .then((serverPosts) => {
        if (cancelled) return
        if (Array.isArray(serverPosts) && serverPosts.length) {
          setPosts(serverPosts)
        }
      })
      .catch(() => { /* keep local */ })
    return () => { cancelled = true }
  }, [])

  // Styles now handled in App.css for responsiveness

  async function handleCreate(newPost) {
    try {
      const created = await api.createPost(newPost)
      setPosts(prev => [created, ...prev])
    } catch {
      setPosts(prev => [{ ...newPost, id: String(Date.now()) }, ...prev])
    }
  }

  async function handleUpdate(updatedPost) {
    try {
      const saved = await api.updatePost(updatedPost.id, updatedPost)
      setPosts(prev => prev.map(p => p.id === saved.id ? saved : p))
    } catch {
      setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this post?')) return
    try {
      await api.deletePost(id)
    } catch {
      // ignore
    }
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="app-root">
      <VisitCounter />
      <div className="app-container">
        <div className="app-header">
          <div>
            <Link to="/" style={{ textDecoration: 'none' }}>My Blog</Link>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {isAdmin && (
              <span style={{ color: 'green', fontSize: 12 }}>Admin Mode</span>
            )}
            <button onClick={() => setShowAdminModal(true)} style={{ fontSize: 12 }}>Admin</button>
          </div>
        </div>

        <Routes>
          <Route path="/" element={
            <Home
              posts={posts}
              isAdmin={isAdmin}
              onCreate={handleCreate}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          } />
          <Route path="/post/:id" element={
            <Post
              posts={posts}
              isAdmin={isAdmin}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          } />
          <Route path="*" element={<div>Page not found: {location.pathname}</div>} />
        </Routes>

        {showAdminModal && (
          <AdminModal
            onClose={() => setShowAdminModal(false)}
            onSubmit={(password) => {
              if (password === TEMP_ADMIN_PASSWORD) {
                setIsAdmin(true)
                setShowAdminModal(false)
                return true
              }
              return false
            }}
          />
        )}
      </div>
    </div>
  )
}

export default App
