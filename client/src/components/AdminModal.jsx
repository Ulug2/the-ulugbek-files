import { useState } from 'react'

export default function AdminModal({ onClose, onSubmit }) {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    function handleSubmit(e) {
        e.preventDefault()
        const ok = onSubmit(password)
        if (!ok) {
            setError('Incorrect password')
        }
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.2)' }}>
            <div style={{
                position: 'absolute', left: '50%', top: '30%', transform: 'translate(-50%, -30%)',
                background: '#fff', border: '1px solid #333', padding: 12, width: 300
            }}>
                <div style={{ marginBottom: 8, fontWeight: 'bold' }}>Admin Login</div>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 8 }}>
                        <label>Password<br />
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%' }} />
                        </label>
                    </div>
                    {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button type="submit">Enter</button>
                        <button type="button" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}


