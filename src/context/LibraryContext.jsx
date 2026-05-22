import { createContext, useContext, useEffect, useState } from 'react';

const LibraryContext = createContext();
const API_URL = 'http://localhost:3001';

function getUserId(email) {
  return email.trim().toLowerCase();
}

// I export this so the rest of the app can wrap itself in the shared context.
export function LibraryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cnook_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    // useEffect runs after render; here I reload data when the user changes.
    async function loadData() {
      // !user means "if there is no user".
      if (!user) {
        setItems([]);
        setLists([]);
        return;
      }

      setLoading(true);
      setError('');
      setItems([]);
      setLists([]);

      try {
        const userId = encodeURIComponent(user.id);

        const itemsResponse = await fetch(`${API_URL}/items?userId=${userId}`);
        if (!itemsResponse.ok) throw new Error('Could not load items');
        const loadedItems = await itemsResponse.json();

        const listsResponse = await fetch(`${API_URL}/lists?userId=${userId}`);
        if (!listsResponse.ok) throw new Error('Could not load lists');
        const loadedLists = await listsResponse.json();

        setItems(loadedItems);
        setLists(loadedLists);
      } catch (err) {
        setError(err.message);
      }

      setLoading(false);
    }

    loadData();
  }, [user]);

  function login(email, name = '') {
    const cleanEmail = email.trim().toLowerCase();
    const displayName = name.trim() || cleanEmail.split('@')[0];
    // This object keeps related user values together as key/value pairs.
    const currentUser = {
      id: getUserId(cleanEmail),
      email: cleanEmail,
      name: displayName,
      initials: displayName.slice(0, 2).toUpperCase(),
    };

    localStorage.setItem('cnook_user', JSON.stringify(currentUser));
    setItems([]);
    setLists([]);
    setUser(currentUser);
  }

  function logout() {
    localStorage.removeItem('cnook_user');
    setUser(null);
    setItems([]);
    setLists([]);
  }

  async function addItem(newItem) {
    if (!user) throw new Error('You must be signed in to add an item.');

    const itemToSave = {
      ...newItem,
      userId: user.id,
      rating: Number(newItem.rating),
      cover: newItem.cover?.trim() || '',
      genres: newItem.genres || [],
      vibes: newItem.vibes || [],
    };
    delete itemToSave.status;

    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemToSave),
    });

    if (!response.ok) throw new Error('Could not add item');
    const savedItem = await response.json();
    setItems(prevItems => [...prevItems, savedItem]);
    return savedItem;
  }

  async function updateItem(id, updatedItem) {
    if (!user) throw new Error('You must be signed in to update an item.');

    const oldItem = items.find(item => item.id === id);
    if (!oldItem || oldItem.userId !== user.id) throw new Error('Item not found');

    const itemToSave = {
      // Spread copies the old item data before I replace some parts.
      ...oldItem,
      ...updatedItem,
      userId: user.id,
      rating: Number(updatedItem.rating),
      cover: updatedItem.cover?.trim() || '',
      genres: updatedItem.genres || [],
      vibes: updatedItem.vibes || [],
    };
    delete itemToSave.status;

    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemToSave),
    });

    if (!response.ok) throw new Error('Could not update item');
    const savedItem = await response.json();
    setItems(prevItems => prevItems.map(item => item.id === id ? savedItem : item));
  }

  async function deleteItem(id) {
    if (!user) throw new Error('You must be signed in to delete an item.');

    const oldItem = items.find(item => item.id === id);
    if (!oldItem || oldItem.userId !== user.id) throw new Error('Item not found');

    const response = await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Could not delete item');

    setItems(prevItems => prevItems.filter(item => item.id !== id));
    setLists(prevLists => prevLists.map(list => ({
      // Spread copies the list, then itemIds gets changed.
      ...list,
      itemIds: (list.itemIds || []).filter(itemId => itemId !== id),
    })));
  }

  async function addList(newList) {
    if (!user) throw new Error('You must be signed in to create a list.');

    const listToSave = {
      name: newList.name.trim(),
      description: newList.description?.trim() || '',
      itemIds: [],
      userId: user.id,
    };

    const response = await fetch(`${API_URL}/lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listToSave),
    });

    if (!response.ok) throw new Error('Could not create list');
    const savedList = await response.json();
    setLists(prevLists => [...prevLists, savedList]);
    return savedList;
  }

  async function updateList(id, updatedList) {
    if (!user) throw new Error('You must be signed in to update a list.');

    const oldList = lists.find(list => list.id === id);
    if (!oldList || oldList.userId !== user.id) throw new Error('List not found');

    const itemIds = (updatedList.itemIds || []).filter(itemId => {
      return items.some(item => item.id === itemId);
    });

    const listToSave = {
      ...oldList,
      ...updatedList,
      itemIds,
      userId: user.id,
    };

    const response = await fetch(`${API_URL}/lists/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(listToSave),
    });

    if (!response.ok) throw new Error('Could not update list');
    const savedList = await response.json();
    setLists(prevLists => prevLists.map(list => list.id === id ? savedList : list));
  }

  async function deleteList(id) {
    if (!user) throw new Error('You must be signed in to delete a list.');

    const oldList = lists.find(list => list.id === id);
    if (!oldList || oldList.userId !== user.id) throw new Error('List not found');

    const response = await fetch(`${API_URL}/lists/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Could not delete list');
    setLists(prevLists => prevLists.filter(list => list.id !== id));
  }

  return (
    <LibraryContext.Provider value={{
      user, login, logout,
      items, lists, loading, error,
      addItem, updateItem, deleteItem,
      addList, updateList, deleteList,
    }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}
