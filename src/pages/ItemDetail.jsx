import { useParams, Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

function ItemDetailPage() {
  const { id } = useParams();
  const { items } = useLibrary();
  const item = items.find(i => i.id === parseInt(id));

  if (!item) return <p>Item not found.</p>;

  return (
    <div>
      <Link to="/"><button>← Back to Library</button></Link>

      <h1 style={{ marginTop: '16px' }}>{item.title}</h1>
      <p><strong>Type:</strong> {item.type}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Rating:</strong> {'⭐'.repeat(item.rating)}</p>
      <p><strong>Notes:</strong> {item.notes}</p>

      <Link to={`/edit/${item.id}`}><button>Edit</button></Link>
    </div>
  );
}

export default ItemDetailPage;