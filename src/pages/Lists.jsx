import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
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
        <Button variant="primary" onClick={() => setShowForm(true)}>
          New list
        </Button>
      </div>

      {error && <div className="alert alert-danger mb-4">{error}</div>}

      {/* Create list form — shown only after clicking "New list" */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleCreate} noValidate>
              <Row className="g-3">
                <Col xs={12} sm={5}>
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
                </Col>
                <Col xs={12} sm={7}>
                  <label htmlFor="list-description" className="field-label">Description</label>
                  <input
                    id="list-description"
                    type="text"
                    className="form-control"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Optional note for this collection"
                  />
                </Col>
              </Row>
              {formError && <p className="text-danger mt-2 mb-0" style={{ fontSize: 13 }}>{formError}</p>}
              <div className="d-flex gap-2 mt-3">
                <Button type="submit" variant="primary">Create list</Button>
                <Button
                  type="button"
                  variant="outline-secondary"
                  onClick={() => { setShowForm(false); setFormError(''); }}
                >
                  Cancel
                </Button>
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
            <Button variant="primary" onClick={() => setShowForm(true)}>
              Create your first list
            </Button>
          </div>
        </div>
      ) : (
        <Row className="row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
          {lists.map((list, index) => (
            <Col key={list.id}>
              <ListCard list={list} index={index} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
