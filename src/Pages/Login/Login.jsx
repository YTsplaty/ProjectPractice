    // src/components/Login.jsx
    import React, { useState, useEffect, useContext } from 'react';
    import { useNavigate, Link } from 'react-router-dom';
    import { auth, googleProvider } from '../../firebase';
    import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
    import { UserContext } from '../../contexts/UserContext';

    const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
        navigate('/');
        }
    }, [user, navigate]);

    // Вхід через email/пароль
    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        try {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged у UserContext автоматично оновить стан
        } catch (error) {
        console.error("Помилка входу:", error);
        setErrorMessage("Неправильний емейл або пароль");
        }
    };

    // Вхід через Google
    const handleGoogleLogin = async () => {
        setErrorMessage('');
        try {
        await signInWithPopup(auth, googleProvider);
        } catch (error) {
        console.error("Помилка входу через Google:", error);
        setErrorMessage("Помилка входу спробуйте ще раз");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <form
            onSubmit={handleEmailLogin}
            className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        >
            <h2 className="text-2xl font-bold mb-4 text-center">Вхід</h2>
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
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors duration-200"
            >
            Увійти
            </button>
            <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full mt-2 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200"
            >
            Увійти через Google
            </button>
            {errorMessage && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded text-center">
                {errorMessage}
            </div>
            )}
            <Link
            to="/register"
            className="block mt-4 text-center text-blue-600 hover:underline"
            >
            Немає акаунту? Зареєструйтесь
            </Link>
        </form>
        </div>
    );
    };

    export default Login;
