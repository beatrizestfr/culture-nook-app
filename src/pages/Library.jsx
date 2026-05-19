import { useState } from 'react';
import { useLibrary } from '../context/LibraryContext';
import ItemCard from '../components/ItemCard';
import AddItemForm from '../components/AddItemForm';

function LibraryPage() {
  const { items, addItem } = useLibrary();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');

  const handleAdd = async (data) => {
    await addItem(data);
    setShowForm(false);
  };

  const filtered = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>My Library</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{ background: '#1a1a2e', color: 'white', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
        >
          {showForm ? 'Cancel' : '+ Add Item'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '8px', marginBottom: '24px' }}>
          <h2 style={{ marginTop: 0 }}>Add New Item</h2>
          <AddItemForm onSubmit={handleAdd} buttonLabel="Add to Library" />
        </div>
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by title..."
          style={{ flex: 1, minWidth: '200px', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
        />
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
        >
          <option value="all">All types</option>
          <option value="movie">Movies</option>
          <option value="book">Books</option>
          <option value="music">Music</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p style={{ color: '#718096' }}>No items found.</p>
      ) : (
        filtered.map(item => <ItemCard key={item.id} item={item} />)
      )}
    </div>
  );
}

export default LibraryPage;