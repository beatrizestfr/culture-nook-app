import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useLibrary } from '../store/LibraryContext';

const QUOTE = {
  text: "A reader lives a thousand lives before he dies. The man who never reads lives only one.",
  author: "George R. R. Martin",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const { login, user } = useLibrary();

  const [tab, setTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [emailDirty, setEmailDirty] = useState(false);

  if (user) return <Navigate to="/" replace />;
  const emailInvalid = emailDirty && email.length > 0 && !EMAIL_REGEX.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    if (!EMAIL_REGEX.test(email)) { setError('Please enter a valid email address.'); return; }
    if (!password.trim()) { setError('Please enter a password.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    login(email, name);
  };

  const switchTab = (t) => { setTab(t); setError(''); setEmailDirty(false); };

  return (
    <div className="row g-0 min-vh-100">

      <div className="col-md-5 login-panel-left d-none d-md-flex flex-column justify-content-between p-5">
        <div>
          <div className="login-logo mb-4">CN</div>
          <h1 className="login-headline">
            My Culture <em>Nook</em>
          </h1>
          <p className="login-tagline">
            Your personal space to track, rate<br />and reflect on the culture you love.
          </p>
        </div>

        <blockquote className="login-quote">
          <p className="mb-2">"{QUOTE.text}"</p>
          <footer>— {QUOTE.author}</footer>
        </blockquote>
      </div>

      <div className="col-12 col-md-7 d-flex flex-column justify-content-center p-4 p-md-5">
        <div className="login-form-inner">

          <div className="tab-switcher mb-4">
            {['signin', 'register'].map(t => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={'tab-btn' + (tab === t ? ' tab-btn-active' : '')}
              >
                {t === 'signin' ? 'Sign in' : 'Create account'}
              </button>
            ))}
          </div>

          <h2 className="login-form-title mb-1">
            {tab === 'signin' ? 'Welcome back' : 'Create your Nook'}
          </h2>
          <p className="text-secondary mb-4" style={{ fontSize: 14 }}>
            {tab === 'signin'
              ? 'Sign in to access your personal library.'
              : 'Set up your account to start tracking the culture you love.'}
          </p>

          <form onSubmit={handleSubmit} noValidate>

            {tab === 'register' && (
              <div className="mb-3">
                <label htmlFor="display-name" className="field-label">
                  Display Name <span className="text-muted fw-normal">(optional)</span>
                </label>
                <input
                  id="display-name"
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="email" className="field-label">Email Address</label>
              <input
                id="email"
                type="email"
                className={'form-control' + (emailInvalid ? ' is-invalid' : '')}
                value={email}
                required
                onChange={e => { setEmail(e.target.value); setError(''); }}
                onBlur={() => setEmailDirty(true)}
                placeholder="you@example.com"
              />
              {emailInvalid && (
                <p className="invalid-feedback d-block">Please enter a valid email address.</p>
              )}
            </div>

            <div className="mb-2">
              <label htmlFor="password" className="field-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-control"
                value={password}
                required
                minLength={6}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                placeholder="password"
              />
              {tab === 'register' && (
                <p className="form-text">Minimum 6 characters</p>
              )}
            </div>

            {error && <p className="text-danger mb-3" style={{ fontSize: 13 }}>{error}</p>}

            <button type="submit" className="btn btn-primary w-100 mt-3 py-3">
              {tab === 'signin' ? 'Sign in to my Nook' : 'Create my Nook'}
            </button>
          </form>

          <hr className="my-4" />

          <p className="text-center text-secondary" style={{ fontSize: 13 }}>
            {tab === 'signin' ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="btn btn-link p-0 fw-semibold"
              style={{ fontSize: 13, color: 'var(--accent)' }}
              onClick={() => switchTab(tab === 'signin' ? 'register' : 'signin')}
            >
              {tab === 'signin' ? "Create one — it's free" : 'Sign in'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
