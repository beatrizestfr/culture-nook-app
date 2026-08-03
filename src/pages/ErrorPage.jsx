import { Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  const is404 = !error || error.status === 404;

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 text-center px-3">
      <h1 className="display-1 fw-bold" style={{ color: 'var(--accent)', fontFamily: 'var(--font-serif)' }}>
        {is404 ? '404' : 'Oops'}
      </h1>
      <h2 className="h4 mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
        {is404 ? 'Page not found' : 'Something went wrong'}
      </h2>
      <p className="text-secondary mb-4" style={{ maxWidth: 400 }}>
        {is404
          ? "The page you're looking for doesn't exist or has been moved."
          : error?.statusText || error?.message || 'An unexpected error occurred.'}
      </p>
      <Link to="/" className="btn btn-primary">
        Go back to Library
      </Link>
    </div>
  );
}
