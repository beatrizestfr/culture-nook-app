import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import Navbar from './components/Navbar';
import LibraryPage from './pages/Library';
import ItemDetailPage from './pages/ItemDetail';
import EditItemPage from './pages/EditItem';
import ListsPage from './pages/Lists';
import ListDetailPage from './pages/ListDetail';
import LoginPage from './pages/Login';

function AppRoutes() {
  const { user } = useLibrary();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/edit/:id" element={<EditItemPage />} />
          <Route path="/lists" element={<ListsPage />} />
          <Route path="/lists/:id" element={<ListDetailPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <LibraryProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LibraryProvider>
  );
}

export default App;