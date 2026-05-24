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
  // I read the current user from context to decide which routes are allowed.
  const { user } = useLibrary();

  if (!user) {
    return (
      <Routes>
        {/* If there is no user, the app only allows the login page. */}
        <Route path="/login" element={<LoginPage />} />
        {/* Any other URL sends the visitor back to login. */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container" style={{ paddingTop: '24px', paddingBottom: '48px' }}>
        <Routes>
          {/* These routes are available after login. */}
          <Route path="/" element={<LibraryPage />} />
          {/* :id means this page changes depending on the item id in the URL. */}
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
    // LibraryProvider shares user, items, lists, and save functions with the app.
    <LibraryProvider>
      {/* BrowserRouter lets Link and Route work without reloading the page. */}
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LibraryProvider>
  );
}

export default App;
