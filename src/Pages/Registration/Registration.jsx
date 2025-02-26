// src/components/Register.jsx
import React, { useState, useContext, useEffect } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

const Register = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // Якщо користувач вже авторизований, перенаправляємо його на головну сторінку
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!displayName.trim() || !email.trim() || !password.trim()) {
        setErrorMessage("Будь ласка, заповніть усі поля");
        return;
    }

    try {
      // Створення користувача за допомогою email/пароль
      const { user: newUser } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Оновлення профілю для додавання displayName
      await updateProfile(newUser, { displayName });
      
      // Після успішної реєстрації перенаправляємо на сторінку логіну
      navigate('/login');
    } catch (error) {
      console.error("Помилка реєстрації:", error);
      setErrorMessage("Помилка реєстрації: " + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Реєстрація</h2>
        {errorMessage && (
          <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
        )}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Ім'я"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200"
        >
          Зареєструватися
        </button>
        <p className="mt-4 text-center">
          Вже маєте акаунт?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Увійдіть
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
