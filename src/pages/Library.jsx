import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import ItemCard from '../components/ItemCard';

function LibraryPage() {
  const { items } = useLibrary();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const visible = items.filter(item => {
    const matchSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || item.type === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h1>My Library</h1>
        <Link to="/edit/new"><button>+ Add Item</button></Link>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '8px', border: '1px solid #e2e8f0', borderRadius: '6px', flex: 1 }}
        />
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All types</option>
          <option value="movie">Movies</option>
          <option value="book">Books</option>
          <option value="music">Music</option>
        </select>
      </div>

      {visible.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

export default LibraryPage;