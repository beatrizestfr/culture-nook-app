import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

// I export this so App can import and show the Navbar.
// Navbar has no props because it gets what it needs inside the component.
export default function Navbar() {
  // Destructuring takes user and logout out of the library object.
  const { user, logout } = useLibrary();
  const location = useLocation();
  // useState stores whether the profile menu is open or closed.
  const [menuOpen, setMenuOpen] = useState(false);

  const navLink = (to, label) => {
    const active = location.pathname === to || (to === '/' && location.pathname === '/');
    return (
      <Link to={to} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
        fontWeight: active ? 600 : 400,
        fontSize: 15,
        textDecoration: active ? 'underline' : 'none',
        textUnderlineOffset: 4,
        transition: 'color 0.15s'
      }}>
        {label}
      </Link>
    );
  };

  return (
    <nav style={{
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div className="page-container" style={{
        display: 'flex', alignItems: 'center',
        height: 60, gap: 32
      }}>
        {/* Logo */}
        {/* Link moves inside the app without a full page reload. */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
            My Culture<em>Nook</em>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', gap: 24, flex: 1 }}>
          {navLink('/', 'Library')}
          {navLink('/lists', 'Lists')}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/edit/new" className="btn-primary" style={{ fontSize: 13, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6 }}>
            Add Item
          </Link>

          {/* Avatar / menu */}
          <div style={{ position: 'relative' }}>
            {/* This arrow function runs on click; ! flips open/closed. */}
            <button onClick={() => setMenuOpen(o => !o)} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--accent)', color: 'white',
              fontWeight: 600, fontSize: 13, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: 'none'
            }}>
              {/* ?. avoids an error if user is not loaded yet. */}
              {user?.initials || 'U'}
            </button>

            {/* This is a short if/else style check inside JSX. */}
            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 46,
                background: 'white', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)', minWidth: 180,
                overflow: 'hidden', zIndex: 200
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)' }}>
                  {/* user?.name means "only read name if user exists". */}
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{user?.name || 'My Profile'}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</p>
                </div>
                <button onClick={() => { setMenuOpen(false); logout(); }} style={{
                  width: '100%', textAlign: 'left', padding: '11px 16px',
                  fontSize: 14, color: '#c0392b', cursor: 'pointer',
                  transition: 'background 0.15s', border: 'none', background: 'transparent'
                }}
                  onMouseEnter={e => e.target.style.background = '#fdf0ef'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
