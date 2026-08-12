import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button, Row, Col } from 'react-bootstrap';
import { useLibrary } from '../store/LibraryContext';
import MediaCover from '../components/MediaCover';
import StarRating from '../components/StarRating';

const GENRES = ['Drama', 'Mystery', 'Romance', 'Horror', 'Indie', 'Sci-Fi', 'Documentary', 'Fantasy', 'Thriller', 'Comedy', 'Biography', 'Historical'];
const RATING_LABELS = ['', 'Not for me', 'It was ok', 'Liked it', 'Loved it', 'Masterpiece'];
const RATINGS = [1, 2, 3, 4, 5];

export default function EditItemPage() {
  const { id } = useParams();
  const isNew = id === 'new';
  const { items, addItem, updateItem } = useLibrary();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '', creator: '', year: '', type: 'movie',
    cover: '', genres: [], rating: 3, notes: '', vibes: [],
  });
  const [vibeInput, setVibeInput] = useState('');

  const [titleDirty, setTitleDirty] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const titleInvalid = titleDirty && !form.title.trim();

  useEffect(() => {
    if (!isNew) {
      const found = items.find(i => i.id === parseInt(id));
      if (found) setForm({ genres: [], vibes: [], ...found });
    }
  }, [id, items, isNew]);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const toggleGenre = (g) => {
    setForm(p => ({
      ...p,
      genres: p.genres?.includes(g)
        ? p.genres.filter(x => x !== g)
        : [...(p.genres || []), g],
    }));
  };

  const addVibe = (e) => {
    if ((e.key === 'Enter' || e.type === 'click') && vibeInput.trim()) {
      e.preventDefault();
      if (!form.vibes?.includes(vibeInput.trim())) {
        set('vibes', [...(form.vibes || []), vibeInput.trim()]);
      }
      setVibeInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTitleDirty(true);
    if (!form.title.trim()) {
      setSubmitError('Title is required.');
      return;
    }
    setSubmitError('');
    if (isNew) await addItem(form);
    else await updateItem(parseInt(id), form);
    navigate('/');
  };

  return (
    <div>
      <Link to="/" className="text-secondary d-inline-block mb-4" style={{ fontSize: 14 }}>
        ← Back to Library
      </Link>

      <h1 className="page-title mb-1">
        {isNew ? 'Add to your Nook' : 'Edit item'}
      </h1>
      <p className="text-secondary mb-4" style={{ fontSize: 14 }}>
        Fill in the details. The more you add, the better your filters become.
      </p>

      <Row className="g-4 align-items-start">

        <Col xs={12} lg={8}>
          <form onSubmit={handleSubmit} noValidate>

            <div className="mb-3">
              <label htmlFor="item-title" className="field-label">
                Title <span className="text-danger">*</span>
              </label>
              <input
                id="item-title"
                type="text"
                className={'form-control' + (titleInvalid ? ' is-invalid' : '')}
                value={form.title}
                required
                onChange={e => { set('title', e.target.value); setSubmitError(''); }}
                onBlur={() => setTitleDirty(true)}
                placeholder="The Secret History"
              />
              {titleInvalid && (
                <p className="invalid-feedback d-block">Title is required.</p>
              )}
            </div>

            <Row className="g-3 mb-3">
              <Col xs={12} sm={6}>
                <label htmlFor="item-creator" className="field-label">Creator / Director / Artist</label>
                <input
                  id="item-creator"
                  type="text"
                  className="form-control"
                  value={form.creator || ''}
                  onChange={e => set('creator', e.target.value)}
                  placeholder="Donna Tartt"
                />
              </Col>
              <Col xs={12} sm={6}>
                <label htmlFor="item-year" className="field-label">Year</label>
                <input
                  id="item-year"
                  type="number"
                  className="form-control"
                  value={form.year || ''}
                  min="1800"
                  max={new Date().getFullYear() + 5}
                  onChange={e => set('year', e.target.value)}
                  placeholder="1992"
                />
              </Col>
            </Row>

            <div className="mb-3">
              <label htmlFor="item-type" className="field-label">Format</label>
              <select
                id="item-type"
                className="form-select"
                value={form.type}
                onChange={e => set('type', e.target.value)}
              >
                <option value="movie">Movie</option>
                <option value="book">Book</option>
                <option value="music">Album</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="item-cover" className="field-label">Cover Image URL (optional)</label>
              <input
                id="item-cover"
                type="url"
                className="form-control"
                value={form.cover || ''}
                onChange={e => set('cover', e.target.value)}
                placeholder="https://... or leave blank for a placeholder"
              />
            </div>

            <div className="mb-4">
              <p className="field-label mb-2">Genre (select all that apply)</p>
              <div className="d-flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGenre(g)}
                    className={'genre-btn' + (form.genres?.includes(g) ? ' genre-btn-active' : '')}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="field-label d-block mb-2">Your Rating</label>
              <div className="star-picker">
                {RATINGS.map(value => (
                  <button
                    key={value}
                    type="button"
                    className={'star-button' + (value <= form.rating ? ' star-selected' : '')}
                    onClick={() => set('rating', value)}
                    aria-label={`${value} star${value !== 1 ? 's' : ''}`}
                  >
                    {value <= form.rating ? '★' : '☆'}
                  </button>
                ))}
              </div>
              <p className="text-secondary mt-1" style={{ fontSize: 13 }}>
                {RATING_LABELS[form.rating]}
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="item-notes" className="field-label">Personal Notes / Review</label>
              <textarea
                id="item-notes"
                className="form-control"
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                rows={5}
                placeholder="What did you think? What did it make you feel? This is your Nook."
              />
            </div>

            <div className="mb-4">
              <p className="field-label mb-1">+ Custom Vibe Tags</p>
              <p className="text-secondary mb-2" style={{ fontSize: 13 }}>
                Add your own descriptive words. Type a word and press Enter or click Add.
              </p>
              <div className="d-flex gap-2 mb-2">
                <input
                  id="vibe-input"
                  type="text"
                  className="form-control"
                  value={vibeInput}
                  onChange={e => setVibeInput(e.target.value)}
                  onKeyDown={addVibe}
                  placeholder="dark academia, cozy, slow-burn..."
                />
                <Button type="button" onClick={addVibe} variant="outline-secondary">
                  Add
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {form.vibes?.map(v => (
                  <span key={v} className="tag tag-vibe d-inline-flex align-items-center gap-1">
                    {v}
                    <button
                      type="button"
                      onClick={() => set('vibes', form.vibes.filter(x => x !== v))}
                      aria-label={`Remove ${v}`}
                      className="tag-remove-btn"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {submitError && (
              <p className="text-danger mb-3" style={{ fontSize: 13 }}>{submitError}</p>
            )}

            <Button type="submit" variant="primary" className="px-4 py-2">
              {isNew ? 'Add to Library' : 'Save Changes'}
            </Button>
          </form>
        </Col>

        <Col xs={12} lg={4}>
          <div className="position-lg-sticky" style={{ top: 80 }}>
            <p className="field-label mb-2">Live Preview</p>
            <div className="card p-3">
              <div className="mb-3" style={{ maxWidth: 180 }}>
                <MediaCover item={form} />
              </div>
              <p className="field-label mb-1">{form.type?.toUpperCase()}</p>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 16 }} className="mb-1">
                {form.title || 'Untitled'}
              </h3>
              {form.creator && (
                <p className="text-secondary mb-2" style={{ fontSize: 13 }}>
                  {form.creator}{form.year ? ` · ${form.year}` : ''}
                </p>
              )}
              <div className="d-flex flex-wrap gap-1 mb-2">
                {form.genres?.slice(0, 3).map(g => <span key={g} className="tag" style={{ fontSize: 11 }}>{g}</span>)}
                {form.vibes?.slice(0, 1).map(v => <span key={v} className="tag tag-vibe" style={{ fontSize: 11 }}>{v}</span>)}
              </div>
              <StarRating rating={form.rating} />
            </div>
          </div>
        </Col>

      </Row>
    </div>
  );
}
