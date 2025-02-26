// src/components/Header.jsx
import React, { useContext } from 'react';
import { UserContext } from '../../contexts/UserContext';

const Header = () => {
  const { user, logout } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Помилка виходу:", error);
    }
  };

  return (
    <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Recipe Book</h1>
      {user && (
        <div className="flex items-center space-x-4">
          <span>{user.displayName ? user.displayName : user.email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Вийти
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
