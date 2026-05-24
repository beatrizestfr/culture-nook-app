import { createContext, useContext, useEffect, useState } from 'react';

const LibraryContext = createContext();
const API_URL = 'http://localhost:3001';

function getUserId(email) {
  // I use the email as a simple user id for this demo project.
  return email.trim().toLowerCase();
}

// I export this so the rest of the app can wrap itself in the shared context.
export function LibraryProvider({ children }) {
  // These states are shared with many pages through context.
  const [items, setItems] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(() => {
    // This keeps the user logged in after refresh.
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

        // I only fetch items that belong to this user.
        const itemsResponse = await fetch(`${API_URL}/items?userId=${userId}`);
        if (!itemsResponse.ok) throw new Error('Could not load items');
        const loadedItems = await itemsResponse.json();

        // Lists are also filtered by userId, so users stay separate.
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
    // I clear old screen data before loading this user's own data.
    setItems([]);
    setLists([]);
    setUser(currentUser);
  }

  function logout() {
    // Logging out removes the saved user and clears private data from the screen.
    localStorage.removeItem('cnook_user');
    setUser(null);
    setItems([]);
    setLists([]);
  }

  async function addItem(newItem) {
    if (!user) throw new Error('You must be signed in to add an item.');

    const itemToSave = {
      // Spread keeps the form fields, then I add user-specific values.
      ...newItem,
      userId: user.id,
      rating: Number(newItem.rating),
      cover: newItem.cover?.trim() || '',
      genres: newItem.genres || [],
      vibes: newItem.vibes || [],
    };
    delete itemToSave.status;

    // POST creates a new item in db.json through json-server.
    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemToSave),
    });

    if (!response.ok) throw new Error('Could not add item');
    const savedItem = await response.json();
    // This updates the UI right away without needing a full refresh.
    setItems(prevItems => [...prevItems, savedItem]);
    return savedItem;
  }

  async function updateItem(id, updatedItem) {
    if (!user) throw new Error('You must be signed in to update an item.');

    const oldItem = items.find(item => item.id === id);
    // This stops one user from editing another user's item.
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

    // PUT replaces the old item with the edited version.
    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemToSave),
    });

    if (!response.ok) throw new Error('Could not update item');
    const savedItem = await response.json();
    // map keeps every item except the one that was just edited.
    setItems(prevItems => prevItems.map(item => item.id === id ? savedItem : item));
  }

  async function deleteItem(id) {
    if (!user) throw new Error('You must be signed in to delete an item.');

    const oldItem = items.find(item => item.id === id);
    if (!oldItem || oldItem.userId !== user.id) throw new Error('Item not found');

    // DELETE removes the item from the fake API.
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
      // A new list starts empty, then items can be added later.
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
      // I only keep ids for items that still exist.
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
    // This replaces just the edited list in state.
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
    // Everything inside this provider can use useLibrary().
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
  // This custom hook is the shortcut I use in pages/components.
  return useContext(LibraryContext);
}
