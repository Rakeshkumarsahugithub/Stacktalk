import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export function UserProvider({ children }) {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const login = (newUsername) => {
    localStorage.setItem('username', newUsername);
    setUsername(newUsername);
  };
  const logout = () => {
    localStorage.removeItem('username');
    setUsername('');
  };
  return (
    <UserContext.Provider value={{ username, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() { return useContext(UserContext); }