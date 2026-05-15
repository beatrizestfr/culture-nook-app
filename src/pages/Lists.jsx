import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

function ListsPage() {
  const { lists, addList } = useLibrary();
  const [name, setName] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addList({ name });
    setName('');
  };

  return (
    <div>
      <h1>My Lists</h1>

      <form onSubmit={handleCreate} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New list name..."
          style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', flex: 1 }}
        />
        <button type="submit">Create</button>
      </form>

      {lists.map(list => (
        <div key={list.id} style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '12px'
        }}>
          <h3>{list.name}</h3>
          <p style={{ color: '#718096' }}>{list.itemIds.length} items</p>
          <Link to={`/lists/${list.id}`}><button>View List</button></Link>
        </div>
      ))}
    </div>
  );
}

export default ListsPage;