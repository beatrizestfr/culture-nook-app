import { Outlet, Navigate } from 'react-router-dom';
import { useLibrary } from '../store/LibraryContext';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  const { user } = useLibrary();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <main className="container-xxl py-4 px-3 px-md-4">
        <Outlet />
      </main>
    </>
  );
}
