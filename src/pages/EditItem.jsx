import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import MediaCover from '../components/MediaCover';

const GENRES = ['Drama', 'Mystery', 'Romance', 'Horror', 'Indie', 'Sci-Fi', 'Documentary', 'Fantasy', 'Thriller', 'Comedy', 'Biography', 'Historical'];
const RATING_LABELS = ['', 'Not for me', 'It was ok', 'Liked it', 'Loved it', 'Masterpiece'];
const RATINGS = [1, 2, 3, 4, 5];

export default function EditItemPage() {
  // The id comes from the URL, for example /edit/100 or /edit/new.
  const { id } = useParams();
  // "new" means I am adding an item instead of editing an old one.
  const isNew = id === 'new';
  const { items, addItem, updateItem } = useLibrary();
  const navigate = useNavigate();

  // I keep all the form fields together in one state object.
  const [form, setForm] = useState({ title: '', creator: '', year: '', type: 'movie', cover: '', genres: [], rating: 3, notes: '', vibes: [] });
  const [vibeInput, setVibeInput] = useState('');

  useEffect(() => {
    // When editing, I fill the form with the item that already exists.
    if (!isNew) {
      const found = items.find(i => i.id === parseInt(id));
      if (found) setForm({ genres: [], vibes: [], ...found });
    }
  }, [id, items, isNew]);

  // Spread copies the old form, then I change only one field.
  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const toggleGenre = (g) => {
    // If the genre is already selected I remove it, otherwise I add it.
    setForm(p => ({
      ...p,
      genres: p.genres?.includes(g) ? p.genres.filter(x => x !== g) : [...(p.genres || []), g]
    }));
  };

  const addVibe = (e) => {
    // This runs when I press Enter or click Add for a custom vibe.
    if ((e.key === 'Enter' || e.type === 'click') && vibeInput.trim()) {
      e.preventDefault();
      // Optional chaining avoids an error if vibes is empty.
      if (!form.vibes?.includes(vibeInput.trim())) {
        set('vibes', [...(form.vibes || []), vibeInput.trim()]);
      }
      setVibeInput('');
    }
  };

  const handleSubmit = async (e) => {
    // I stop the browser refresh and let React handle saving.
    e.preventDefault();
    if (!form.title.trim()) return alert('Title is required');
    // The same page handles both add and edit.
    if (isNew) await addItem(form);
    else await updateItem(parseInt(id), form);
    navigate('/');
  };

  const label = (text) => (
    <label style={{ display: 'block', fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
      {text}
    </label>
  );

  return (
    <div>
      <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>
        Back to Library
      </Link>

      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, marginBottom: 4 }}>
        {isNew ? 'Add to your Nook' : 'Edit item'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
        Fill in the details. The more you add, the better your filters become.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 40, alignItems: 'start' }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              {label('Title')}
              <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. The Secret History" required />
            </div>
            <div>
              {label('Creator / Director / Artist')}
              <input value={form.creator || ''} onChange={e => set('creator', e.target.value)} placeholder="e.g. Donna Tartt" />
            </div>
            <div>
              {label('Year')}
              <input value={form.year || ''} onChange={e => set('year', e.target.value)} placeholder="e.g. 1992" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              {label('Format')}
              <select value={form.type} onChange={e => set('type', e.target.value)}>
                <option value="movie">Movie</option>
                <option value="book">Book</option>
                <option value="music">Album</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            {label('Cover Image URL (optional)')}
            <input value={form.cover || ''} onChange={e => set('cover', e.target.value)} placeholder="https://... or leave blank for a placeholder" />
          </div>

          <div style={{ marginBottom: 20 }}>
            {label('Genre (select all that apply)')}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {GENRES.map(g => (
                <button key={g} type="button" onClick={() => toggleGenre(g)} style={{
                  padding: '7px 14px', borderRadius: 99, fontSize: 13, fontWeight: 500,
                  background: form.genres?.includes(g) ? 'var(--accent)' : 'white',
                  color: form.genres?.includes(g) ? 'white' : 'var(--text-secondary)',
                  border: `1px solid ${form.genres?.includes(g) ? 'var(--accent)' : 'var(--border)'}`,
                  transition: 'all 0.15s', cursor: 'pointer'
                }}>
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            {label('Your Rating')}
            <div className="star-picker">
              {/* Each star is a button that saves a number from 1 to 5. */}
              {RATINGS.map(value => (
                <button
                  key={value}
                  type="button"
                  className={`star-button ${value <= form.rating ? 'star-selected' : ''}`}
                  onClick={() => set('rating', value)}
                  aria-label={`${value} star rating`}
                >
                  {value <= form.rating ? '\u2605' : '\u2606'}
                </button>
              ))}
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6 }}>{RATING_LABELS[form.rating]}</p>
          </div>

          <div style={{ marginBottom: 20 }}>
            {label('Personal Notes / Review')}
            <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={5}
              placeholder="What did you think? What did it make you feel? No spoilers... or all the spoilers. This is your Nook." />
          </div>

          <div style={{ marginBottom: 28 }}>
            {label('+ Custom Vibe Tags')}
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Add your own descriptive words. Type a word and press Enter or click Add.
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input value={vibeInput} onChange={e => setVibeInput(e.target.value)} onKeyDown={addVibe} placeholder="e.g. dark academia, cozy, slow-burn" style={{ flex: 1 }} />
              <button type="button" onClick={addVibe} className="btn-secondary">Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {/* Each vibe tag can remove itself from the form state. */}
              {form.vibes?.map(v => (
                <span key={v} className="tag tag-vibe" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {v}
                  <button type="button" onClick={() => set('vibes', form.vibes.filter(x => x !== v))} aria-label={`Remove ${v}`} style={{ opacity: 0.6, color: 'inherit', fontSize: 12, padding: 0 }}>Remove</button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ fontSize: 15, padding: '13px 28px' }}>
            {isNew ? 'Add to Library' : 'Save Changes'}
          </button>
        </form>

        {/* Live preview */}
        <div style={{ position: 'sticky', top: 80 }}>
          <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12 }}>Live Preview</p>
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', padding: 16, border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-sm)' }}>
            {/* Mini cover */}
            <div style={{ maxWidth: 180, marginBottom: 12 }}>
              {/* I reuse MediaCover so the preview works like the real cards. */}
              <MediaCover item={form} />
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, marginBottom: 4 }}>
              {form.type?.toUpperCase()}
            </p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16, marginBottom: 2 }}>{form.title || 'Untitled'}</h3>
            {form.creator && <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{form.creator}{form.year ? ` - ${form.year}` : ''}</p>}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
              {form.genres?.slice(0, 3).map(g => <span key={g} className="tag" style={{ fontSize: 11 }}>{g}</span>)}
              {form.vibes?.slice(0, 1).map(v => <span key={v} className="tag tag-vibe" style={{ fontSize: 11 }}>{v}</span>)}
            </div>
            <p className="stars" aria-label={`${form.rating} star rating`}>
              {/* repeat turns the number rating into filled and empty stars. */}
              {'\u2605'.repeat(form.rating)}<span className="stars-empty">{'\u2606'.repeat(5 - form.rating)}</span>
            </p>
          </div>
          {form.vibes?.length > 0 && (
            <div style={{ marginTop: 16, padding: '12px 14px', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', fontSize: 13, color: 'var(--text-secondary)' }}>
              Your vibe tags (<strong>{form.vibes.slice(0,2).join(', ')}{form.vibes.length > 2 ? '...' : ''}</strong>) will appear as filter options in your Library.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
