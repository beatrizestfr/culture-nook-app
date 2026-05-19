import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import ListCard from '../components/ListCard';

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

      {lists.length === 0 && <p style={{ color: '#718096' }}>No lists yet. Create one above!</p>}

      {lists.map(list => (
        <ListCard key={list.id} list={list} />
      ))}
    </div>
  );
}

export default ListsPage;