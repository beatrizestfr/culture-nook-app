export default function StarRating({ rating = 0 }) {
  const count = Number(rating) || 0;
  return (
    <p className="stars mb-0" aria-label={`${count} out of 5 stars`}>
      {'★'.repeat(count)}
      <span className="stars-empty">{'☆'.repeat(5 - count)}</span>
    </p>
  );
}
