import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import ItemCard from '../components/ItemCard';

const FORMATS = ['All', 'Movies', 'Books', 'Albums'];
const GENRES = ['All', 'Romance', 'Horror', 'Indie', 'Sci-Fi', 'Drama', 'Documentary', 'Fantasy', 'Thriller', 'Comedy', 'Mystery', 'Biography', 'Historical'];
const STATUSES = ['All', 'Planned', 'In Progress', 'Done'];

export default function LibraryPage() {
  const { items, loading, error } = useLibrary();
  const [search, setSearch] = useState('');
  const [format, setFormat] = useState('All');
  const [genre, setGenre] = useState('All');
  const [status, setStatus] = useState('All');

  const filtered = items.filter(item => {
    const q = search.toLowerCase();
    const matchSearch = !q || item.title?.toLowerCase().includes(q) || item.creator?.toLowerCase().includes(q);
    const matchFormat = format === 'All' || item.type === format.toLowerCase().replace('albums', 'music').replace('movies', 'movie').replace('books', 'book');
    const matchGenre = genre === 'All' || item.genres?.includes(genre);
    const matchStatus = status === 'All' || item.status === status.toLowerCase().replace(' ', '-');
    return matchSearch && matchFormat && matchGenre && matchStatus;
  });

  const FilterRow = ({ label, options, value, onChange }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', minWidth: 56 }}>
        {label}
      </span>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} className={`filter-pill ${value === o ? 'active' : ''}`}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36 }}>
            <span style={{ color: 'var(--text-primary)' }}>Your </span>
            <em style={{ color: 'var(--accent-light)' }}>Library</em>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            {items.length} items tracked · Last updated today
          </p>
        </div>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: 260 }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search titles, creators, tags..."
            style={{ background: 'white', border: '1px solid var(--border)' }}
          />
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 24, padding: '16px 0', borderBottom: '1px solid var(--border-light)' }}>
        <FilterRow label="Format" options={FORMATS} value={format} onChange={setFormat} />
        <FilterRow label="Genre" options={GENRES} value={genre} onChange={setGenre} />
        <FilterRow label="Status" options={STATUSES} value={status} onChange={setStatus} />
      </div>

      {/* Count + sort */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Showing {filtered.length} items</p>
      </div>

      {error && (
        <div style={{ background: '#fdf0ef', border: '1px solid #f1c0bb', color: '#9d2c20', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading your library...</p>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, marginBottom: 8 }}>Nothing found</p>
          <p style={{ fontSize: 14 }}>Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="card-grid">
          {filtered.map(item => <ItemCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}
