import { Outlet, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
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
      <Container as="main" fluid="xxl" className="py-4 px-3 px-md-4">
        <Outlet />
      </Container>
    </>
  );
}
