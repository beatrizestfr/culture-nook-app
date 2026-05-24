import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import MediaCover from './MediaCover';

export default function ListCard({ list }) {
  // I use context here so the card can show preview covers and delete itself.
  const { items, deleteList } = useLibrary();
  // The list only stores ids, so I find the real item objects here.
  const listItems = items.filter(i => list.itemIds?.includes(i.id));
  const preview = listItems.slice(0, 3);
  const extra = listItems.length - 3;

  const handleDelete = async () => {
    // I confirm first because deleting a list removes it from the API.
    if (window.confirm(`Delete list "${list.name}"?`)) {
      await deleteList(list.id);
    }
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: 'var(--radius-lg)',
      padding: '20px',
      border: '1px solid var(--border-light)',
      boxShadow: 'var(--shadow-sm)',
      transition: 'box-shadow 0.2s',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
    >
      <div style={{ flex: 1 }}>
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, marginBottom: 4 }}>{list.name}</h3>
        {list.description && <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{list.description}</p>}
      </div>

      <div style={{ display: 'flex', gap: 4, minHeight: 44 }}>
        {/* I show up to three item covers as a quick preview. */}
        {preview.map(item => (
          <div key={item.id} style={{ width: 44, flexShrink: 0 }}>
            <MediaCover item={item} square />
          </div>
        ))}
        {preview.length === 0 && (
          // Empty lists still get a fallback cover block.
          <div style={{ width: 44, flexShrink: 0 }}>
            <MediaCover type="list" title={list.name} square />
          </div>
        )}
        {extra > 0 && (
          // If there are more than three items, I show how many are hidden.
          <div style={{ width: 44, height: 44, borderRadius: 6, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
            +{extra}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {list.itemIds?.length || 0} item{list.itemIds?.length !== 1 ? 's' : ''}
        </span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* This click deletes the list instead of opening the View link. */}
          <button onClick={handleDelete} style={{ fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>Delete</button>
          {/* Link changes pages inside the React app without reloading. */}
          <Link to={`/lists/${list.id}`} style={{
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}>
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
