import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import ListCard from '../components/ListCard';

export default function ListsPage() {
  const { lists, addList, loading, error } = useLibrary();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');

  const handleCreate = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFormError('List name is required.');
      return;
    }

    try {
      const saved = await addList({ name: trimmedName, description, itemIds: [] });
      setName('');
      setDescription('');
      setFormError('');
      setShowForm(false);
      navigate(`/lists/${saved.id}`);
    } catch (err) {
      setFormError(err.message || 'Could not create the list.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36 }}>
            Your <em style={{ color: 'var(--accent-light)' }}>Lists</em>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
            {lists.length} personal list{lists.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          New list
        </button>
      </div>

      {error && (
        <div style={{ background: '#fdf0ef', border: '1px solid #f1c0bb', color: '#9d2c20', borderRadius: 'var(--radius-md)', padding: 14, marginBottom: 20 }}>
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} style={{
          background: 'white',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: 20,
          boxShadow: 'var(--shadow-sm)',
          marginBottom: 24,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px, 1fr) minmax(260px, 2fr)', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                List name
              </label>
              <input value={name} onChange={e => { setName(e.target.value); setFormError(''); }} placeholder="Weekend watchlist" autoFocus />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
                Description
              </label>
              <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional note for this collection" />
            </div>
          </div>
          {formError && <p style={{ color: '#c0392b', fontSize: 13, marginTop: 10 }}>{formError}</p>}
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button type="submit" className="btn-primary">Create list</button>
            <button type="button" className="btn-secondary" onClick={() => { setShowForm(false); setFormError(''); }}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading your lists...</p>
      ) : lists.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '72px 20px',
          background: 'white',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <p style={{ fontFamily: 'var(--font-serif)', fontSize: 22, marginBottom: 8 }}>No lists yet</p>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 18 }}>Create your first personal list.</p>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            Create your first list
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {lists.map((list, index) => <ListCard key={list.id} list={list} index={index} />)}
        </div>
      )}
    </div>
  );
}
