import { Link } from 'react-router-dom';
import MediaCover from './MediaCover';

// I export this so I can import ItemCard in another file.
// The { item } part takes item out of the props object.
export default function ItemCard({ item }) {
  // This is a short if/else for choosing the dot color.
  const dotColor = item.status === 'done' ? '#4caf7d' : item.status === 'in-progress' ? '#e6a817' : '#a0aec0';

  return (
    // Link changes pages inside React without reloading the whole app.
    <Link to={`/items/${item.id}`} style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{ cursor: 'pointer' }} className="item-card-hover">
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <MediaCover item={item} />
          <div style={{
            position: 'absolute',
            top: 8,
            right: 8,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: dotColor,
            border: '2px solid white',
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
            zIndex: 2,
          }} />
        </div>

        <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 3 }}>
          {item.type?.toUpperCase()}
        </p>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 2, fontFamily: 'var(--font-serif)' }}>
          {/* These braces let me write JavaScript inside JSX. */}
          {item.title}
        </h3>
        {item.creator && (
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{item.creator}</p>
        )}
        {(item.genres?.length > 0 || item.vibes?.length > 0) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 5 }}>
            {/* ?. avoids an error if genres does not exist yet. */}
            {item.genres?.slice(0, 2).map(g => <span key={g} className="tag" style={{ fontSize: 11, padding: '2px 7px' }}>{g}</span>)}
            {item.vibes?.slice(0, 1).map(v => <span key={v} className="tag tag-vibe" style={{ fontSize: 11, padding: '2px 7px' }}>{v}</span>)}
          </div>
        )}
        <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Rating: {item.rating || 0}/5</p>
      </div>
    </Link>
  );
}
