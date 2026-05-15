import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';

function EditItemPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const { items, addItem, updateItem } = useLibrary();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    type: 'movie',
    status: 'planned',
    rating: 3,
    notes: ''
  });

  useEffect(() => {
    if (!isNew) {
      const found = items.find(i => i.id === parseInt(id));
      if (found) setForm(found);
    }
  }, [id, items, isNew]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return alert('Title is required');
    if (isNew) {
      await addItem(form);
    } else {
      await updateItem(parseInt(id), form);
    }
    navigate('/');
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <h1>{isNew ? 'Add Item' : 'Edit Item'}</h1>
      <form onSubmit={handleSubmit}>

        <label>Title<br />
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
          />
        </label>

        <label>Type<br />
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
          >
            <option value="movie">Movie</option>
            <option value="book">Book</option>
            <option value="music">Music</option>
          </select>
        </label>

        <label>Status<br />
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
          >
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>

        <label>Rating (1–5)<br />
          <input
            name="rating"
            type="number"
            min="1"
            max="5"
            value={form.rating}
            onChange={handleChange}
            style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
          />
        </label>

        <label>Notes<br />
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            style={{ width: '100%', padding: '8px', marginBottom: '16px' }}
          />
        </label>

        <button type="submit">{isNew ? 'Add to Library' : 'Save Changes'}</button>

      </form>
    </div>
  );
}

export default EditItemPage;