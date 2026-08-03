import { Link } from 'react-router-dom';
import MediaCover from './MediaCover';
import StarRating from './StarRating';

export default function ItemCard({ item }) {
  return (
    <Link to={`/items/${item.id}`} className="d-block text-decoration-none item-card-hover">
      <div className="mb-2">
        <MediaCover item={item} />
      </div>

      <p className="field-label mb-1">{item.type?.toUpperCase()}</p>
      <h3 className="item-card-title mb-1">{item.title}</h3>

      {item.creator && (
        <p className="text-secondary mb-1" style={{ fontSize: 12 }}>{item.creator}</p>
      )}

      {(item.genres?.length > 0 || item.vibes?.length > 0) && (
        <div className="d-flex flex-wrap gap-1 mb-1">
          {item.genres?.slice(0, 2).map(g => (
            <span key={g} className="tag" style={{ fontSize: 11, padding: '2px 7px' }}>{g}</span>
          ))}
          {item.vibes?.slice(0, 1).map(v => (
            <span key={v} className="tag tag-vibe" style={{ fontSize: 11, padding: '2px 7px' }}>{v}</span>
          ))}
        </div>
      )}

      <StarRating rating={item.rating} />
    </Link>
  );
}
