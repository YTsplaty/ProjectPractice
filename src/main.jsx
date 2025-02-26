import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RecipeProvider } from './contexts/RecipeContext';
import { UserProvider } from './contexts/UserContext';
import './index.css'; // Підключення TailwindCSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RecipeProvider>
        <App />
      </RecipeProvider>
    </UserProvider>
  </React.StrictMode>
);
