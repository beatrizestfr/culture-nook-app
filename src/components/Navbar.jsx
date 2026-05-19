import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

export default function Navbar() {
  const { user, logout } = useLibrary();
  const location = useLocation();
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
            <button onClick={() => setMenuOpen(o => !o)} style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--accent)', color: 'white',
              fontWeight: 600, fontSize: 13, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', border: 'none'
            }}>
              {user?.initials || 'U'}
            </button>

            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: 46,
                background: 'white', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)', minWidth: 180,
                overflow: 'hidden', zIndex: 200
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)' }}>
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
