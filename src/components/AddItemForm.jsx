import { useState } from 'react';

// This is where the parent passes values and functions into this form.
function AddItemForm({ onSubmit, initialData = {}, buttonLabel = 'Save' }) {
  // useState stores text that can change on the screen.
  const [title, setTitle] = useState(initialData.title || '');
  const [type, setType] = useState(initialData.type || 'movie');
  const [status, setStatus] = useState(initialData.status || 'planned');
  const [rating, setRating] = useState(initialData.rating || 1);
  const [notes, setNotes] = useState(initialData.notes || '');

  const handleSubmit = (e) => {
    // e is the submit event; this stops the page from refreshing.
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a title.');
      return;
    }
    onSubmit({ title, type, status, rating: Number(rating), notes });
  };

  // I pass the function to React here; handleSubmit() would run right away.
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Title</label>
        {/* React controls this input with the title state. */}
        {/* This runs when I type, and target.value is the typed text. */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter title..."
          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
        />
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Type</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
        >
          <option value="movie">Movie</option>
          <option value="book">Book</option>
          <option value="music">Music</option>
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
        >
          <option value="planned">Planned</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
          Rating: {rating} / 5
        </label>
        <input
          type="range"
          min="1"
          max="5"
          value={rating}
          onChange={e => setRating(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Your thoughts..."
          rows={4}
          style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #e2e8f0' }}
        />
      </div>

      <button
        type="submit"
        style={{
          background: '#1a1a2e', color: 'white',
          padding: '10px 20px', borderRadius: '6px',
          border: 'none', cursor: 'pointer', fontWeight: 'bold'
        }}
      >
        {buttonLabel}
      </button>
    </form>
  );
}

export default AddItemForm;
