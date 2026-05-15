import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LibraryProvider } from './context/LibraryContext';
import Navbar from './components/Navbar';
import LibraryPage from './pages/Library';
import ItemDetailPage from './pages/ItemDetail';
import EditItemPage from './pages/EditItem';
import ListsPage from './pages/Lists';
import ListDetailPage from './pages/ListDetail';

function App() {
  return (
    <LibraryProvider>
      <BrowserRouter>
        <Navbar />
        <div style={{ padding: '20px' }}>
          <Routes>
            <Route path="/" element={<LibraryPage />} />
            <Route path="/items/:id" element={<ItemDetailPage />} />
            <Route path="/edit/:id" element={<EditItemPage />} />
            <Route path="/lists" element={<ListsPage />} />
            <Route path="/lists/:id" element={<ListDetailPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </LibraryProvider>
  );
}

export default App;