import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';

const QUOTE = {
  text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
  author: "George R. R. Martin"
};

export default function LoginPage() {
  // login comes from context, so this page can set the current user.
  const { login } = useLibrary();
  // I use tab to switch between sign in and create account.
  const [tab, setTab] = useState('signin');
  // These states make the form inputs controlled by React.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    // preventDefault stops the form from refreshing the whole page.
    e.preventDefault();
    // These checks give simple feedback before logging in.
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (!password.trim()) { setError('Please enter a password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    // In a real app, you'd verify credentials against a backend
    // For now, we just accept any email + password >= 6 chars
    login(email, name);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div style={{
        width: '40%', minWidth: 280, background: '#c9b99a',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '48px 40px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: 40, right: 40, width: 120, height: 120, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />
        <div style={{ position: 'absolute', bottom: 80, left: -40, width: 200, height: 200, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} />

        <div>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <span style={{ color: 'white', fontWeight: 700 }}>CN</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', color: 'white', fontSize: 36, lineHeight: 1.2, marginBottom: 12 }}>
            My Culture <em>Nook</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.7 }}>
            Your personal space to track, rate<br />and reflect on the culture you love.
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '20px 24px', backdropFilter: 'blur(4px)' }}>
          <p style={{ color: 'white', fontStyle: 'italic', fontSize: 14, lineHeight: 1.7, marginBottom: 10 }}>
            "{QUOTE.text}"
          </p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>
            - {QUOTE.author}
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '48px',
        maxWidth: 520, margin: '0 auto'
      }}>
        <div style={{
          display: 'flex', background: 'var(--bg-input)',
          borderRadius: 10, padding: 4, marginBottom: 36,
          border: '1px solid var(--border)'
        }}>
          {/* This map creates the two tab buttons. */}
          {['signin', 'register'].map(t => (
            <button key={t} onClick={() => { setTab(t); setError(''); }} style={{
              flex: 1, padding: '9px 0', borderRadius: 8,
              background: tab === t ? 'white' : 'transparent',
              color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: tab === t ? 600 : 400,
              fontSize: 14, transition: 'all 0.2s',
              boxShadow: tab === t ? 'var(--shadow-sm)' : 'none', cursor: 'pointer', border: 'none'
            }}>
              {t === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          ))}
        </div>

        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, marginBottom: 8 }}>
          {tab === 'signin' ? 'Welcome back' : 'Create your Nook'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 28, fontSize: 14 }}>
          {tab === 'signin'
            ? 'Sign in to access your personal library.'
            : 'Set up your account to start tracking the culture you love.'}
        </p>

        <form onSubmit={handleSubmit}>
          {/* The name field only appears when creating an account. */}
          {tab === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
                Display Name (optional)
              </label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Sofia" />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Email Address
            </label>
            {/* e.target.value is the text the user typed. */}
            <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} placeholder="you@example.com" />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 6 }}>
              Password
            </label>
            <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError(''); }} placeholder="password" />
            {tab === 'register' && <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Minimum 6 characters</p>}
          </div>

          {/* I only show the error paragraph when there is an error message. */}
          {error && <p style={{ color: '#c0392b', fontSize: 13, marginBottom: 12 }}>{error}</p>}

          <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 15, marginTop: 16 }}>
            {tab === 'signin' ? 'Sign in to my Nook' : 'Create my Nook'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
          {tab === 'signin' ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setTab(tab === 'signin' ? 'register' : 'signin'); setError(''); }} style={{ color: 'var(--accent)', fontWeight: 600, cursor: 'pointer' }}>
            {tab === 'signin' ? "Create one - it's free" : 'Sign in'}
          </span>
        </p>
      </div>
    </div>
  );
}
