import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import MediaCover from '../components/MediaCover';

export default function ListDetailPage() {
  // The list id comes from /lists/:id.
  const { id } = useParams();
  const { lists, items, updateList, deleteList, loading } = useLibrary();
  const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState('');
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState('');

  // I find the list that matches the URL id.
  const list = lists.find(l => l.id === Number(id));

  if (loading) return <p style={{ padding: 40, color: 'var(--text-secondary)' }}>Loading list...</p>;

  if (!list) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, marginBottom: 8 }}>List not found</p>
        <p style={{ fontSize: 14, marginBottom: 18 }}>This list does not exist for this account.</p>
        <Link to="/lists"><button className="btn-primary">Back to Lists</button></Link>
      </div>
    );
  }

  const listItemIds = list.itemIds || [];
  // Lists store ids, so I match those ids to the real item objects.
  const listItems = items.filter(item => listItemIds.includes(item.id));
  // This keeps the dropdown from showing items already in the list.
  const availableItems = items.filter(item => !listItemIds.includes(item.id));

  async function handleAddItem(e) {
    // The add-item form should update the list without refreshing.
    e.preventDefault();
    if (!selectedItemId) return;

    const itemId = Number(selectedItemId);
    // Spread copies the list and itemIds before I add the new item.
    await updateList(list.id, { ...list, itemIds: [...listItemIds, itemId] });
    setSelectedItemId('');
  }

  async function handleRemoveItem(itemId) {
    // Removing means saving the same list without this item's id.
    await updateList(list.id, { ...list, itemIds: listItemIds.filter(id => id !== itemId) });
  }

  async function handleRename(e) {
    // Rename is also a form, so I stop the page refresh here.
    e.preventDefault();
    if (!newName.trim()) return;

    await updateList(list.id, { ...list, name: newName.trim() });
    setRenaming(false);
  }

  async function handleDelete() {
    // After deleting this list, I go back to the Lists page.
    if (window.confirm(`Delete list "${list.name}"?`)) {
      await deleteList(list.id);
      navigate('/lists');
    }
  }

  return (
    <div>
      <Link to="/lists" style={{ display: 'inline-block', color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Back to Lists
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          {renaming ? (
            <form onSubmit={handleRename} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input value={newName} onChange={e => setNewName(e.target.value)} autoFocus />
              <button type="submit" className="btn-primary">Save</button>
              <button type="button" className="btn-secondary" onClick={() => setRenaming(false)}>Cancel</button>
            </form>
          ) : (
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, marginBottom: 4 }}>{list.name}</h1>
          )}
          {list.description && <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{list.description}</p>}
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>{listItems.length} items</p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={() => { setRenaming(true); setNewName(list.name); }}>Rename</button>
          <button className="btn-danger" onClick={handleDelete}>Delete list</button>
        </div>
      </div>

      <form onSubmit={handleAddItem} style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <select value={selectedItemId} onChange={e => setSelectedItemId(e.target.value)}>
          <option value="">Choose an item to add</option>
          {/* The select options come from items not already in the list. */}
          {availableItems.map(item => (
            <option key={item.id} value={item.id}>{item.title} ({item.type})</option>
          ))}
        </select>
        <button type="submit" className="btn-primary" disabled={!selectedItemId}>Add item</button>
      </form>

      {listItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 20, marginBottom: 8 }}>This list is empty</p>
          <p style={{ fontSize: 14 }}>Add items from your library with the selector above.</p>
        </div>
      ) : (
        <div className="card-grid">
          {/* One small item card is created for each item in this list. */}
          {listItems.map(item => (
            <div key={item.id}>
              <Link to={`/items/${item.id}`}>
                <MediaCover item={item} />
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, marginTop: 8 }}>{item.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{item.type}</p>
                <p className="stars" aria-label={`${item.rating || 0} star rating`}>
                  {'\u2605'.repeat(item.rating || 0)}<span className="stars-empty">{'\u2606'.repeat(5 - (item.rating || 0))}</span>
                </p>
              </Link>
              {/* This button is outside the Link, so its click only removes the item. */}
              <button className="btn-secondary" onClick={() => handleRemoveItem(item.id)} style={{ marginTop: 8 }}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
