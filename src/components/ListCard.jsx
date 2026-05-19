import { Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

function ListCard({ list }) {
  const { deleteList } = useLibrary();

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px'
    }}>
      <h3 style={{ margin: '0 0 8px' }}>{list.name}</h3>
      <p style={{ color: '#718096', margin: '0 0 12px' }}>
        {list.itemIds.length} item{list.itemIds.length !== 1 ? 's' : ''}
      </p>
      <div style={{ display: 'flex', gap: '8px' }}>
        <Link to={`/lists/${list.id}`}><button>View</button></Link>
        <button onClick={() => deleteList(list.id)} style={{ color: 'red' }}>Delete</button>
      </div>
    </div>
  );
}

export default ListCard;