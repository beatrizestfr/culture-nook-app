import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

function ItemCard({ item }) {
  const { deleteItem } = useLibrary();

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    }}>
      <h3 style={{ margin: '0 0 8px' }}>{item.title}</h3>
      <p style={{ color: '#718096', margin: '0 0 4px' }}>
        {item.type} · {item.status} · {'⭐'.repeat(item.rating)}
      </p>
      <p style={{ color: '#4a5568', margin: '0 0 12px', fontStyle: 'italic' }}>
        {item.notes}
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link to={`/items/${item.id}`}><button>View</button></Link>
        <Link to={`/edit/${item.id}`}><button>Edit</button></Link>
        <button onClick={() => deleteItem(item.id)} style={{ color: 'red' }}>Delete</button>
      </div>
    </div>
  );
}

export default ItemCard;