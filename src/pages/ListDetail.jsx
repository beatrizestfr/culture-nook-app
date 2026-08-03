import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLibrary } from '../store/LibraryContext';
import MediaCover from '../components/MediaCover';
import StarRating from '../components/StarRating';

export default function ListDetailPage() {
  const { id } = useParams();
  const { lists, items, updateList, deleteList, loading } = useLibrary();
  const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');

  const list = lists.find(l => l.id === Number(id));

  if (loading) return <p className="text-secondary p-5">Loading list...</p>;

  if (!list) {
    return (
      <div className="text-center py-5 text-secondary">
        <p className="page-title mb-2" style={{ fontSize: 22 }}>List not found</p>
        <p className="mb-4" style={{ fontSize: 14 }}>This list does not exist for this account.</p>
        <Link to="/lists" className="btn btn-primary">Back to Lists</Link>
      </div>
    );
  }

  const listItemIds = list.itemIds || [];
  const listItems = items.filter(item => listItemIds.includes(item.id));
  const availableItems = items.filter(item => !listItemIds.includes(item.id));

  async function handleAddItem(e) {
    e.preventDefault();
    if (!selectedItemId) return;
    const itemId = Number(selectedItemId);
    await updateList(list.id, { ...list, itemIds: [...listItemIds, itemId] });
    setSelectedItemId('');
  }

  async function handleRemoveItem(itemId) {
    await updateList(list.id, { ...list, itemIds: listItemIds.filter(i => i !== itemId) });
  }

  async function handleRename(e) {
    e.preventDefault();
    if (!newName.trim()) return;
    await updateList(list.id, { ...list, name: newName.trim() });
    setRenaming(false);
  }

  async function handleDelete() {
    if (window.confirm(`Delete list "${list.name}"?`)) {
      await deleteList(list.id);
      navigate('/lists');
    }
  }

  return (
    <div>
      <Link to="/lists" className="text-secondary d-inline-block mb-4" style={{ fontSize: 14 }}>
        ← Back to Lists
      </Link>

      <div className="d-flex justify-content-between align-items-start gap-3 mb-4 flex-wrap">
        <div>
          {renaming ? (
            <form onSubmit={handleRename} className="d-flex gap-2 flex-wrap">
              <input
                id="rename-input"
                type="text"
                className="form-control"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                required
                autoFocus
              />
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-outline-secondary" onClick={() => setRenaming(false)}>
                Cancel
              </button>
            </form>
          ) : (
            <h1 className="page-title mb-1">{list.name}</h1>
          )}
          {list.description && <p className="text-secondary mb-1" style={{ fontSize: 14 }}>{list.description}</p>}
          <p className="text-secondary mb-0" style={{ fontSize: 14 }}>{listItems.length} item{listItems.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button
            className="btn btn-outline-secondary"
            onClick={() => { setRenaming(true); setNewName(list.name); }}
          >
            Rename
          </button>
          <button className="btn btn-outline-danger" onClick={handleDelete}>
            Delete list
          </button>
        </div>
      </div>

      {/* Add item form */}
      <form onSubmit={handleAddItem} className="d-flex gap-2 mb-4 flex-wrap">
        <label htmlFor="add-item-select" className="visually-hidden">Choose an item to add</label>
        <select
          id="add-item-select"
          className="form-select"
          value={selectedItemId}
          onChange={e => setSelectedItemId(e.target.value)}
          style={{ maxWidth: 400 }}
        >
          <option value="">Choose an item to add</option>
          {availableItems.map(item => (
            <option key={item.id} value={item.id}>
              {item.title} ({item.type})
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary" disabled={!selectedItemId}>
          Add item
        </button>
      </form>

      {listItems.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <p className="page-title mb-2" style={{ fontSize: 20 }}>This list is empty</p>
          <p style={{ fontSize: 14 }}>Add items from your library with the selector above.</p>
        </div>
      ) : (
        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-xl-5 g-3">
          {listItems.map(item => (
            <div key={item.id} className="col">
              <Link to={`/items/${item.id}`} className="d-block text-decoration-none">
                <MediaCover item={item} />
                <h3 className="mt-2 mb-0" style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-secondary mb-1" style={{ fontSize: 12 }}>{item.type}</p>
                <StarRating rating={item.rating} />
              </Link>
              <button
                className="btn btn-outline-secondary btn-sm mt-2 w-100"
                onClick={() => handleRemoveItem(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
