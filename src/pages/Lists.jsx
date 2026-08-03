import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLibrary } from '../store/LibraryContext';
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
      <div className="d-flex justify-content-between align-items-start gap-3 mb-4 flex-wrap">
        <div>
          <h1 className="page-title">
            Your <em style={{ color: 'var(--accent-light)' }}>Lists</em>
          </h1>
          <p className="text-secondary mt-1" style={{ fontSize: 14 }}>
            {lists.length} personal list{lists.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          New list
        </button>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Create list form — shown only after clicking "New list" */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleCreate} noValidate>
              <div className="row g-3">
                <div className="col-12 col-sm-5">
                  <label htmlFor="list-name" className="field-label">
                    List name <span className="text-danger">*</span>
                  </label>
                  <input
                    id="list-name"
                    type="text"
                    className="form-control"
                    value={name}
                    required
                    onChange={e => { setName(e.target.value); setFormError(''); }}
                    placeholder="Weekend watchlist"
                    autoFocus
                  />
                </div>
                <div className="col-12 col-sm-7">
                  <label htmlFor="list-description" className="field-label">Description</label>
                  <input
                    id="list-description"
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Optional note for this collection"
                  />
                </div>
              </div>
              {formError && <p className="text-danger mt-2 mb-0" style={{ fontSize: 13 }}>{formError}</p>}
              <div className="d-flex gap-2 mt-3">
                <button type="submit" className="btn btn-primary">Create list</button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => { setShowForm(false); setFormError(''); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-secondary">Loading your lists...</p>
      ) : lists.length === 0 ? (
        <div className="card text-center py-5">
          <div className="card-body">
            <p className="page-title mb-2" style={{ fontSize: 22 }}>No lists yet</p>
            <p className="text-secondary mb-4" style={{ fontSize: 14 }}>Create your first personal list.</p>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              Create your first list
            </button>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
          {lists.map((list, index) => (
            <div key={list.id} className="col">
              <ListCard list={list} index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
