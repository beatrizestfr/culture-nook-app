import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{
      background: '#1a1a2e',
      padding: '12px 24px',
      display: 'flex',
      gap: '24px',
      alignItems: 'center'
    }}>
      <span style={{ color: 'white', fontWeight: 'bold', marginRight: 'auto' }}>
        My Culture Nook
      </span>
      <Link to="/" style={{ color: '#a0aec0', textDecoration: 'none' }}>Library</Link>
      <Link to="/lists" style={{ color: '#a0aec0', textDecoration: 'none' }}>Lists</Link>
    </nav>
  );
}

export default Navbar;