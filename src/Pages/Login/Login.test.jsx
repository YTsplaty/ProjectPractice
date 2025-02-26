import React from 'react';
import { render, screen } from '@testing-library/react';
// import Login from './Login';
import { BrowserRouter } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';

// Мок функцій з Firebase
jest.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: jest.fn(() => Promise.resolve()),
  signInWithPopup: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../firebase', () => ({
  auth: {},
  googleProvider: {},
}));

// Мок useNavigate з react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Компонент Login', () => {
  test('рендериться форма логіну з усіма елементами', () => {
    render(
      <UserContext.Provider value={{ user: null }}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </UserContext.Provider>
    );

    // Перевірка наявності полів вводу
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Пароль')).toBeInTheDocument();

    // Перевірка кнопок
    expect(screen.getByRole('button', { name: 'Увійти' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Увійти через Google' })).toBeInTheDocument();

    // Перевірка посилання на реєстрацію
    expect(screen.getByText('Немає акаунту? Зареєструйтесь')).toBeInTheDocument();
  });
});
