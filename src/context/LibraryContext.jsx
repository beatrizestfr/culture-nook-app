import { createContext, useContext, useState, useEffect } from 'react';

const LibraryContext = createContext();

export function LibraryProvider({ children }) {
  const [items, setItems] = useState([]);
  const [lists, setLists] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/items')
      .then(res => res.json())
      .then(data => setItems(data));

    fetch('http://localhost:3001/lists')
      .then(res => res.json())
      .then(data => setLists(data));
  }, []);

  const addItem = async (newItem) => {
    const res = await fetch('http://localhost:3001/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    const saved = await res.json();
    setItems(prev => [...prev, saved]);
  };

  const updateItem = async (id, updated) => {
    const res = await fetch(`http://localhost:3001/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    });
    const saved = await res.json();
    setItems(prev => prev.map(i => i.id === id ? saved : i));
  };

  const deleteItem = async (id) => {
    await fetch(`http://localhost:3001/items/${id}`, { method: 'DELETE' });
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const addList = async (newList) => {
    const res = await fetch('http://localhost:3001/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newList, itemIds: [] })
    });
    const saved = await res.json();
    setLists(prev => [...prev, saved]);
  };

  const updateList = async (id, updated) => {
  const res = await fetch(`http://localhost:3001/lists/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated)
  });
  const saved = await res.json();
  setLists(prev => prev.map(l => l.id === id ? saved : l));
};

const deleteList = async (id) => {
  await fetch(`http://localhost:3001/lists/${id}`, { method: 'DELETE' });
  setLists(prev => prev.filter(l => l.id !== id));
};

  return (
    <LibraryContext.Provider value={{ items, lists, addItem, updateItem, deleteItem, addList, updateList, deleteList }}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  return useContext(LibraryContext);
}