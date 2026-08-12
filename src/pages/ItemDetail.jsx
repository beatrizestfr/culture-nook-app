import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { useLibrary } from '../store/LibraryContext';
import MediaCover from '../components/MediaCover';
import StarRating from '../components/StarRating';

const RATING_LABELS = { 1: 'Not for me', 2: 'It was ok', 3: 'Liked it', 4: 'Loved it', 5: 'Masterpiece' };

export default function ItemDetailPage() {
  const { id } = useParams();
  const { items, deleteItem, loading } = useLibrary();
  const navigate = useNavigate();
  const item = items.find(i => i.id === Number(id));

  if (loading) return <p className="text-secondary p-5">Loading item...</p>;
  if (!item) return <p className="text-secondary p-5">Item not found for the current account.</p>;

  const handleDelete = async () => {
    if (window.confirm(`Delete "${item.title}"?`)) {
      await deleteItem(item.id);
      navigate('/');
    }
  };

  return (
    <div>
      <Link to="/" className="text-secondary d-inline-block mb-4" style={{ fontSize: 14 }}>
        ← Back to Library
      </Link>

      <Row className="g-4 align-items-start">

        <Col xs={12} md={4}>
          <div className="mb-3 shadow-sm">
            <MediaCover item={item} />
          </div>

          <div className="card mb-3 text-center">
            <div className="card-body py-3">
              <p className="field-label mb-2">Your Rating</p>
              <StarRating rating={item.rating} />
              <p className="text-secondary mt-1 mb-0" style={{ fontSize: 13 }}>
                {RATING_LABELS[item.rating] || ''}
              </p>
            </div>
          </div>

          <div className="card mb-3">
            <div className="card-body">
              <p className="field-label mb-3">Details</p>
              <table className="w-100" style={{ fontSize: 13 }}>
                <tbody>
                  <tr>
                    <td className="text-muted pb-2">Format</td>
                    <td className="text-end fw-medium pb-2">{item.type}</td>
                  </tr>
                  {item.year && (
                    <tr>
                      <td className="text-muted">Year</td>
                      <td className="text-end fw-medium">{item.year}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {(item.genres?.length > 0 || item.vibes?.length > 0) && (
            <div className="card mb-3">
              <div className="card-body">
                <p className="field-label mb-2">Tags & Genres</p>
                <div className="d-flex flex-wrap gap-1">
                  {item.genres?.map(g => <span key={g} className="tag">{g}</span>)}
                  {item.vibes?.map(v => <span key={v} className="tag tag-vibe">{v}</span>)}
                </div>
              </div>
            </div>
          )}

          <Link to={`/edit/${item.id}`} className="btn btn-primary w-100 mb-2">
            Edit item
          </Link>
          <Button variant="outline-danger" className="w-100" onClick={handleDelete}>
            Delete item
          </Button>
        </Col>

        <Col xs={12} md={8}>
          <p className="field-label mb-1">
            {item.type?.toUpperCase()} {item.year && `· ${item.year}`}
          </p>
          <h1 className="page-title mb-2">{item.title}</h1>
          {item.creator && (
            <p className="mb-4" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--accent-light)' }}>
              {item.creator}
            </p>
          )}

          <div className="border-top pt-4">
            <p className="field-label mb-3" style={{ color: 'var(--accent-light)' }}>Your Review & Notes</p>
            <div className="card">
              <div className="card-body py-4 px-4">
                {item.notes
                  ? <p style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.8 }}>{item.notes}</p>
                  : <p className="text-muted fst-italic">No notes yet. Edit this item to add your thoughts.</p>
                }
              </div>
            </div>
          </div>

          {item.vibes?.length > 0 && (
            <div className="mt-4">
              <p className="field-label mb-2" style={{ color: 'var(--accent-light)' }}>Your Custom Vibes</p>
              <div className="d-flex flex-wrap gap-2">
                {item.vibes.map(v => <span key={v} className="tag tag-vibe">{v}</span>)}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}
