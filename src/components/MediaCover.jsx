import { useState } from 'react';

export default function MediaCover({ item, type = '', title = '', square = false }) {
  const [failed, setFailed] = useState(false);
  const cover = item?.cover || '';
  const itemType = item?.type || type || 'item';
  const label = itemType === 'music' ? 'album' : itemType;

  return (
    <div className={`media-cover ${square ? 'media-cover-square' : ''}`}>
      {cover && !failed && (
        <img
          src={cover}
          alt={item?.title || title || 'cover'}
          onError={() => setFailed(true)}
        />
      )}
      {(!cover || failed) && (
        <div className="media-cover-fallback">
          <span className="media-cover-type">{label}</span>
          <span className="media-cover-title">{item?.title || title || 'No cover'}</span>
        </div>
      )}
    </div>
  );
}
