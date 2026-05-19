import { useParams, Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import { useState } from 'react';

function ListDetailPage() {
  const { id } = useParams();
  const { lists, items, updateList } = useLibrary();
  const [selectedItemId, setSelectedItemId] = useState('');

  const list = lists.find(l => l.id === parseInt(id));
  if (!list) return <p>List not found.</p>;

  const listItems = items.filter(item => list.itemIds.includes(item.id));

  // Items NOT yet in this list (available to add)
  const availableItems = items.filter(item => !list.itemIds.includes(item.id));

  const handleAddItem = async () => {
    if (!selectedItemId) return;
    const updated = { ...list, itemIds: [...list.itemIds, parseInt(selectedItemId)] };
    await updateList(list.id, updated);
    setSelectedItemId('');
  };

  const handleRemoveItem = async (itemId) => {
    const updated = { ...list, itemIds: list.itemIds.filter(i => i !== itemId) };
    await updateList(list.id, updated);
  };

  return (
    <div>
      <Link to="/lists"><button>← Back to Lists</button></Link>

      <h1 style={{ marginTop: '16px' }}>{list.name}</h1>

      {/* Add item to list */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', marginTop: '8px' }}>
        <select
          value={selectedItemId}
          onChange={e => setSelectedItemId(e.target.value)}
          style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', flex: 1 }}
        >
          <option value="">— Add an item to this list —</option>
          {availableItems.map(item => (
            <option key={item.id} value={item.id}>
              {item.title} ({item.type})
            </option>
          ))}
        </select>
        <button onClick={handleAddItem}>Add</button>
      </div>

      {listItems.length === 0 && <p style={{ color: '#718096' }}>No items in this list yet.</p>}

      {listItems.map(item => (
        <div key={item.id} style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ margin: '0 0 4px' }}>{item.title}</h3>
            <p style={{ margin: 0, color: '#718096' }}>{item.type} · {'⭐'.repeat(item.rating)}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to={`/items/${item.id}`}><button>View</button></Link>
            <button
              onClick={() => handleRemoveItem(item.id)}
              style={{ color: 'red' }}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListDetailPage;