import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'

import Home from './pages/Home.jsx'
import Post from './pages/Post.jsx'
import AdminModal from './components/AdminModal.jsx'
import { getPostsFromStorage, savePostsToStorage } from './utils/storage.js'

const TEMP_ADMIN_PASSWORD = 'letmein'

function App() {
  const [posts, setPosts] = useState(() => getPostsFromStorage())
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const location = useLocation()

  useEffect(() => {
    savePostsToStorage(posts)
  }, [posts])

  // Minimal 90s style inline layout
  const containerStyle = useMemo(() => ({
    maxWidth: 800,
    margin: '0 auto',
    padding: '16px',
    background: '#fff',
    border: '1px solid #ccc',
  }), [])

  const headerStyle = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px',
  }), [])

  function handleCreate(newPost) {
    setPosts(prev => [{ ...newPost, id: String(Date.now()) }, ...prev])
  }

  function handleUpdate(updatedPost) {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  function handleDelete(id) {
    if (!window.confirm('Delete this post?')) return
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
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
  )
}

export default App
