import { useState } from 'react';

export default function MediaCover({ item, type = '', title = '', square = false }) {
  // I use this to know if an image URL failed to load.
  const [failed, setFailed] = useState(false);
  // Optional chaining keeps this safe if item is missing.
  const cover = item?.cover || '';
  const itemType = item?.type || type || 'item';
  const label = itemType === 'music' ? 'album' : itemType;

  return (
    <div className={`media-cover ${square ? 'media-cover-square' : ''}`}>
      {cover && !failed && (
        <img
          src={cover}
          alt={item?.title || title || 'cover'}
          // If the image breaks, I switch to the fallback design.
          onError={() => setFailed(true)}
        />
      )}
      {/* I show this when there is no cover or the image failed. */}
      {(!cover || failed) && (
        <div className="media-cover-fallback">
          <span className="media-cover-type">{label}</span>
          <span className="media-cover-title">{item?.title || title || 'No cover'}</span>
        </div>
      )}
    </div>
  );
}
