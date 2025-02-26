// RecipeForm.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RecipeForm from './RecipeForm';
import { RecipeContext } from '../../contexts/RecipeContext';

describe('RecipeForm', () => {
  let addRecipeMock;

  // Допоміжна функція для рендерингу компонента з контекстом
  const renderComponent = () =>
    render(
      <RecipeContext.Provider value={{ addRecipe: addRecipeMock }}>
        <RecipeForm />
      </RecipeContext.Provider>
    );

  beforeEach(() => {
    addRecipeMock = jest.fn();
  });

  test('рендериться всі елементи форми', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Назва рецепту *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Опис/інструкції *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Інгредієнти (через кому)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Додати рецепт/i })).toBeInTheDocument();
  });

  test('відображається повідомлення про помилку, якщо обовʼязкові поля порожні', async () => {
    renderComponent();
    fireEvent.click(screen.getByRole('button', { name: /Додати рецепт/i }));

    expect(await screen.findByText(/Будь ласка, заповніть обовʼязкові поля/i)).toBeInTheDocument();
    expect(addRecipeMock).not.toHaveBeenCalled();
  });

  test('успішна відправка: викликається addRecipe і поля очищуються', async () => {
    addRecipeMock.mockResolvedValueOnce();
    renderComponent();

    const titleInput = screen.getByPlaceholderText('Назва рецепту *');
    const bodyInput = screen.getByPlaceholderText('Опис/інструкції *');
    const ingredientsInput = screen.getByPlaceholderText('Інгредієнти (через кому)');
    const submitButton = screen.getByRole('button', { name: /Додати рецепт/i });

    // Заповнюємо форму
    fireEvent.change(titleInput, { target: { value: 'Test Recipe' } });
    fireEvent.change(bodyInput, { target: { value: 'Test description' } });
    fireEvent.change(ingredientsInput, { target: { value: 'salt, pepper' } });

    fireEvent.click(submitButton);

    await waitFor(() => expect(addRecipeMock).toHaveBeenCalledTimes(1));

    // Перевірка виклику addRecipe з очікуваними даними
    expect(addRecipeMock).toHaveBeenCalledWith({
      title: 'Test Recipe',
      body: 'Test description',
      ingredients: ['salt', 'pepper']
    });

    // Перевірка, що поля очищено
    expect(titleInput.value).toBe('');
    expect(bodyInput.value).toBe('');
    expect(ingredientsInput.value).toBe('');
  });

  test('під час відправки всі поля та кнопка стають недоступними', async () => {
    // Створюємо проміс, який не вирішується одразу
    let resolvePromise;
    const promise = new Promise((resolve) => { resolvePromise = resolve; });
    addRecipeMock.mockReturnValue(promise);

    renderComponent();

    const titleInput = screen.getByPlaceholderText('Назва рецепту *');
    const bodyInput = screen.getByPlaceholderText('Опис/інструкції *');
    const ingredientsInput = screen.getByPlaceholderText('Інгредієнти (через кому)');
    const submitButton = screen.getByRole('button', { name: /Додати рецепт/i });

    // Заповнюємо форму
    fireEvent.change(titleInput, { target: { value: 'Test Recipe' } });
    fireEvent.change(bodyInput, { target: { value: 'Test description' } });
    fireEvent.change(ingredientsInput, { target: { value: 'salt, pepper' } });

    fireEvent.click(submitButton);

    // Перевірка, що всі елементи стали недоступними
    expect(titleInput).toBeDisabled();
    expect(bodyInput).toBeDisabled();
    expect(ingredientsInput).toBeDisabled();
    expect(submitButton).toBeDisabled();

    // Завершуємо проміс, щоб компонент оновився
    resolvePromise();
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });

  test('відображається повідомлення про помилку у випадку невдалої відправки', async () => {
    addRecipeMock.mockRejectedValueOnce(new Error('error'));
    renderComponent();

    const titleInput = screen.getByPlaceholderText('Назва рецепту *');
    const bodyInput = screen.getByPlaceholderText('Опис/інструкції *');
    const submitButton = screen.getByRole('button', { name: /Додати рецепт/i });

    fireEvent.change(titleInput, { target: { value: 'Test Recipe' } });
    fireEvent.change(bodyInput, { target: { value: 'Test description' } });

    fireEvent.click(submitButton);

    const errorElement = await screen.findByText(/Сталася помилка при додаванні рецепту/i);
    expect(errorElement).toBeInTheDocument();
  });
});
