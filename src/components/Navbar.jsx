import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { useLibrary } from '../store/LibraryContext';

const navLinkClass = ({ isActive }) =>
  'nav-link' + (isActive ? ' active fw-semibold' : '');

export default function Navbar() {
  const { user, logout } = useLibrary();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <BSNavbar expand="md" sticky="top" className="app-navbar border-bottom">
      <Container fluid="xxl" className="px-3 px-md-4">

        <BSNavbar.Brand as={Link} to="/" className="app-brand me-4">
          My Culture<em>Nook</em>
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="main-nav" />

        <BSNavbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <NavLink to="/" end className={navLinkClass}>Library</NavLink>
            <NavLink to="/lists" className={navLinkClass}>Lists</NavLink>
          </Nav>

          <Nav className="align-items-md-center gap-2 mt-2 mt-md-0">
            <Link to="/edit/new" className="btn btn-primary btn-sm">
              Add Item
            </Link>

            <div className="position-relative">
              <button
                onClick={() => setMenuOpen(o => !o)}
                className="avatar-btn"
                aria-label="Open profile menu"
                aria-expanded={menuOpen}
              >
                {user?.initials || 'U'}
              </button>

              {menuOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <p className="fw-semibold mb-0" style={{ fontSize: 13 }}>{user?.name}</p>
                    <p className="text-muted mb-0" style={{ fontSize: 12 }}>{user?.email}</p>
                  </div>
                  <button
                    className="logout-btn"
                    onClick={() => { setMenuOpen(false); logout(); }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </Nav>
        </BSNavbar.Collapse>

      </Container>
    </BSNavbar>
  );
}
