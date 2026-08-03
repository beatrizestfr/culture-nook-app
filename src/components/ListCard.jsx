import { Link } from 'react-router-dom';
import { useLibrary } from '../store/LibraryContext';
import MediaCover from './MediaCover';

export default function ListCard({ list }) {
  const { items, deleteList } = useLibrary();
  const listItems = items.filter(i => list.itemIds?.includes(i.id));
  const preview = listItems.slice(0, 3);
  const extra = listItems.length - 3;

  const handleDelete = async () => {
    if (window.confirm(`Delete list "${list.name}"?`)) {
      await deleteList(list.id);
    }
  };

  return (
    <div className="card h-100 list-card">
      <div className="card-body d-flex flex-column gap-3">

        <div>
          <h3 className="card-title" style={{ fontFamily: 'var(--font-serif)', fontSize: 17 }}>
            {list.name}
          </h3>
          {list.description && (
            <p className="card-text text-secondary" style={{ fontSize: 13, lineHeight: 1.5 }}>
              {list.description}
            </p>
          )}
        </div>

        <div className="d-flex gap-1" style={{ minHeight: 44 }}>
          {preview.map(item => (
            <div key={item.id} style={{ width: 44, flexShrink: 0 }}>
              <MediaCover item={item} square />
            </div>
          ))}
          {preview.length === 0 && (
            <div style={{ width: 44, flexShrink: 0 }}>
              <MediaCover type="list" title={list.name} square />
            </div>
          )}
          {extra > 0 && (
            <div
              className="d-flex align-items-center justify-content-center text-secondary fw-semibold"
              style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--bg)', fontSize: 12 }}
            >
              +{extra}
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="text-secondary" style={{ fontSize: 13 }}>
            {list.itemIds?.length || 0} item{list.itemIds?.length !== 1 ? 's' : ''}
          </span>
          <div className="d-flex gap-3 align-items-center">
            <button
              onClick={handleDelete}
              className="btn btn-link p-0 text-muted"
              style={{ fontSize: 12 }}
            >
              Delete
            </button>
            <Link
              to={`/lists/${list.id}`}
              className="fw-semibold"
              style={{ fontSize: 13, color: 'var(--accent)' }}
            >
              View →
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
