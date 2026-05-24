import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import MediaCover from '../components/MediaCover';

const RATING_LABELS = { 1: 'Not for me', 2: 'It was ok', 3: 'Liked it', 4: 'Loved it', 5: 'Masterpiece' };

export default function ItemDetailPage() {
  // useParams reads the item id from /items/:id.
  const { id } = useParams();
  const { items, deleteItem, loading } = useLibrary();
  const navigate = useNavigate();
  // I find the one item that matches the id in the URL.
  const item = items.find(i => i.id === Number(id));
  const rating = Number(item?.rating) || 0;

  // These returns stop the page early while data is missing.
  if (loading) return <p style={{ padding: 40, color: 'var(--text-secondary)' }}>Loading item...</p>;
  if (!item) return <p style={{ padding: 40, color: 'var(--text-secondary)' }}>Item not found for the current account.</p>;

  const handleDelete = async () => {
    // I ask first because deleting is permanent in the fake API.
    if (window.confirm(`Delete "${item.title}"?`)) {
      await deleteItem(item.id);
      navigate('/');
    }
  };

  return (
    <div>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Back to Library
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40, alignItems: 'start' }} className="detail-grid">
        <div>
          <div style={{ marginBottom: 16, boxShadow: 'var(--shadow-md)' }}>
            <MediaCover item={item} />
          </div>

          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: 12, textAlign: 'center', border: '1px solid var(--border-light)' }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 600 }}>Your Rating</p>
            <p className="stars" aria-label={`${rating} star rating`} style={{ fontSize: 20 }}>
              {/* The stored number becomes stars on the screen here. */}
              {'\u2605'.repeat(rating)}<span className="stars-empty">{'\u2606'.repeat(5 - rating)}</span>
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              {RATING_LABELS[item.rating] || ''}
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: 12, border: '1px solid var(--border-light)' }}>
            <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 12, fontWeight: 600 }}>Details</p>
            <table style={{ width: '100%', fontSize: 13 }}>
              <tbody>
                <tr>
                  <td style={{ color: 'var(--text-muted)', paddingBottom: 8 }}>Format</td>
                  <td style={{ textAlign: 'right', fontWeight: 500 }}>
                    {item.type}
                  </td>
                </tr>
                {item.year && <tr><td style={{ color: 'var(--text-muted)', paddingBottom: 8 }}>Year</td><td style={{ textAlign: 'right', fontWeight: 500 }}>{item.year}</td></tr>}
              </tbody>
            </table>
          </div>

          {(item.genres?.length > 0 || item.vibes?.length > 0) && (
            <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: 16, border: '1px solid var(--border-light)' }}>
              <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600 }}>Tags & Genres</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {/* These maps create one tag for each genre or vibe. */}
                {item.genres?.map(g => <span key={g} className="tag">{g}</span>)}
                {item.vibes?.map(v => <span key={v} className="tag tag-vibe">{v}</span>)}
              </div>
            </div>
          )}

          <Link to={`/edit/${item.id}`}>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', display: 'flex', marginBottom: 8 }}>
              Edit item
            </button>
          </Link>
          <button className="btn-danger" style={{ width: '100%' }} onClick={handleDelete}>
            Delete item
          </button>
        </div>

        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>
            {item.type?.toUpperCase()} {item.year && `- ${item.year}`}
          </p>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 40, lineHeight: 1.15, marginBottom: 8 }}>{item.title}</h1>
          {item.creator && <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--accent-light)', marginBottom: 24 }}>{item.creator}</p>}

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--accent-light)', marginBottom: 16 }}>Your Review & Notes</p>
            <div style={{ background: 'white', borderRadius: 'var(--radius-md)', padding: '28px 32px', border: '1px solid var(--border-light)' }}>
              {item.notes
                ? <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.8, color: 'var(--text-primary)' }}>{item.notes}</p>
                : <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No notes yet. Edit this item to add your thoughts.</p>
              }
            </div>
          </div>

          {item.vibes?.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--accent-light)', marginBottom: 12 }}>Your Custom Vibes</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {item.vibes.map(v => <span key={v} className="tag tag-vibe">{v}</span>)}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
