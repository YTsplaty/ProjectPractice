import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserContext } from './contexts/UserContext.jsx';
import RecipeList from './components/RecipeList/RecipeList';
import RecipeForm from './components/RecipeForm/RecipeForm';
import Login from './Pages/Login/Login.jsx';
import Registration from './Pages/Registration/Registration.jsx'
import Header from './components/Header/Header.jsx';

const Home = () =>{
  const { user } = useContext(UserContext);
  return (
    <>
    
      <Header />
    <div className="container mx-auto p-4">
      <RecipeForm />
      <RecipeList />
    </div>
    </>
  );
}

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Якщо користувач не авторизований – переадресація на Login */}
        <Route path="/register" element={<Registration />} />
        <Route path="/" element={ user ? <Home /> : <Navigate to="/login" replace /> } />
      </Routes>
    </Router>
  );
};

export default App;
