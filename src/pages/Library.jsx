import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLibrary } from '../store/LibraryContext';
import ItemCard from '../components/ItemCard';
import { Row, Col } from 'react-bootstrap';

const FORMATS = ['All', 'Movies', 'Books', 'Albums'];
const GENRES = ['All', 'Romance', 'Horror', 'Indie', 'Sci-Fi', 'Drama', 'Documentary', 'Fantasy', 'Thriller', 'Comedy', 'Mystery', 'Biography', 'Historical'];

function FilterRow({ label, options, value, onChange }) {
  return (
    <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
      <span className="field-label mb-0" style={{ minWidth: 56 }}>{label}</span>
      <div className="d-flex gap-2 flex-wrap">
        {options.map(o => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={'filter-pill' + (value === o ? ' active' : '')}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const { items, loading, error } = useLibrary();
  const [search, setSearch] = useState('');
  const [format, setFormat] = useState('All');
  const [genre, setGenre] = useState('All');

  const filtered = items.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = !q || item.title?.toLowerCase().includes(q) || item.creator?.toLowerCase().includes(q);
    const matchFormat = format === 'All' || item.type === format.toLowerCase().replace('albums', 'music').replace('movies', 'movie').replace('books', 'book');
    const matchGenre = genre === 'All' || item.genres?.includes(genre);
    return matchSearch && matchFormat && matchGenre;
  });

  return (
    <div>
      {/* Page header */}
      <div className="d-flex justify-content-between align-items-start mb-2 flex-wrap gap-3">
        <div>
          <h1 className="page-title">
            Your <em style={{ color: 'var(--accent-light)' }}>Library</em>
          </h1>
          <p className="text-secondary" style={{ fontSize: 14, marginTop: 4 }}>
            {items.length} items tracked
          </p>
        </div>
        <div>
          <input
            id="search"
            type="search"
            className="form-control"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search titles, creators..."
            style={{ minWidth: 240 }}
          />
        </div>
      </div>

      {/* Filter rows */}
      <div className="mb-4 pb-3 border-bottom">
        <FilterRow label="Format" options={FORMATS} value={format} onChange={setFormat} />
        <FilterRow label="Genre" options={GENRES} value={genre} onChange={setGenre} />
      </div>

      <p className="text-secondary mb-3" style={{ fontSize: 14 }}>
        Showing {filtered.length} item{filtered.length !== 1 ? 's' : ''}
      </p>

      {error && (
        <div className="alert alert-danger mb-4" role="alert">{error}</div>
      )}

      {loading ? (
        <p className="text-secondary">Loading your library...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p className="page-title" style={{ fontSize: 20, marginBottom: 8 }}>Nothing found</p>
          <p style={{ fontSize: 14 }}>Try adjusting your filters or search terms.</p>
          <Link to="/edit/new" className="btn btn-primary mt-3">Add your first item</Link>
        </div>
      ) : (
        <Row className="row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5 g-3">
          {filtered.map(item => (
            <Col key={item.id}>
              <ItemCard item={item} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
