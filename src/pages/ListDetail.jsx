import { useParams, Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

function ListDetailPage() {
  const { id } = useParams();
  const { lists, items } = useLibrary();
  const list = lists.find(l => l.id === parseInt(id));

  if (!list) return <p>List not found.</p>;

  const listItems = items.filter(item => list.itemIds.includes(item.id));

  return (
    <div>
      <Link to="/lists"><button>← Back to Lists</button></Link>

      <h1 style={{ marginTop: '16px' }}>{list.name}</h1>

      {listItems.length === 0 && <p>No items in this list yet.</p>}

      {listItems.map(item => (
        <div key={item.id} style={{
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '8px'
        }}>
          <h3>{item.title}</h3>
          <p>{item.type} · {'⭐'.repeat(item.rating)}</p>
          <Link to={`/items/${item.id}`}><button>View</button></Link>
        </div>
      ))}
    </div>
  );
}

export default ListDetailPage;