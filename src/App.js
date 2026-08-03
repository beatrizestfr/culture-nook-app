import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LibraryProvider } from './store/LibraryContext';

import RootLayout from './pages/RootLayout';
import ErrorPage from './pages/ErrorPage';
import LibraryPage from './pages/Library';
import ItemDetailPage from './pages/ItemDetail';
import EditItemPage from './pages/EditItem';
import ListsPage from './pages/Lists';
import ListDetailPage from './pages/ListDetail';
import LoginPage from './pages/Login';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LibraryPage /> },
      { path: 'items/:id', element: <ItemDetailPage /> },
      { path: 'edit/:id', element: <EditItemPage /> },
      { path: 'lists', element: <ListsPage /> },
      { path: 'lists/:id', element: <ListDetailPage /> },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
]);

function App() {
  return (
    <LibraryProvider>
      <RouterProvider router={router} />
    </LibraryProvider>
  );
}

export default App;
