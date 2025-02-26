import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RecipeList from './RecipeList';
import { RecipeContext } from '../../contexts/RecipeContext';
import { UserProvider } from '../../contexts/UserContext';

// Мокаємо компонент RecipeCard, який використовується в RecipeList
jest.mock('../RecipeCard/RecipeCard', () => (props) => (
  <div data-testid="recipe-card">
    {props.recipe.title}
    <button onClick={() => props.onUpdate(props.recipe)}>Update</button>
    <button onClick={() => props.onDelete(props.recipe.id)}>Delete</button>
  </div>
));

describe('RecipeList Component', () => {
  const searchRecipesMock = jest.fn();
  const updateRecipeMock = jest.fn();
  const deleteRecipeMock = jest.fn();

  // Функція для рендерингу RecipeList із контекстом
  const renderWithContext = (recipes = []) => {
    return render(
            <UserProvider user={{email:"asdasd"}}>
        
      <RecipeContext.Provider
        value={{
          recipes,
          searchRecipes: searchRecipesMock,
          updateRecipe: updateRecipeMock,
          deleteRecipe: deleteRecipeMock,
        }}
      >
        <RecipeList />
      </RecipeContext.Provider>
      </UserProvider>
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('рендериться інпут для пошуку і повідомлення, якщо рецептів немає', () => {
    renderWithContext([]);

    // Перевірка наявності інпуту для пошуку
    const input = screen.getByPlaceholderText('Пошук рецептів...');
    expect(input).toBeInTheDocument();

    // Перевірка, що відображається повідомлення про відсутність рецептів
    expect(screen.getByText('Поки немає рецептів')).toBeInTheDocument();
  });

  test('викликається функція searchRecipes при зміні значення інпуту', () => {
    renderWithContext([]);

    const input = screen.getByPlaceholderText('Пошук рецептів...');
    fireEvent.change(input, { target: { value: 'Суп' } });
    
    expect(searchRecipesMock).toHaveBeenCalledWith('Суп');
  });

  test('рендеряться RecipeCard для кожного рецепту', () => {
    const recipes = [
      { id: 1, title: 'Суп', description: 'Смачний суп' },
      { id: 2, title: 'Піца', description: 'Смачна піца' },
    ];

    renderWithContext(recipes);

    // Очікуємо, що кількість RecipeCard відповідає кількості рецептів
    const recipeCards = screen.getAllByTestId('recipe-card');
    expect(recipeCards.length).toBe(recipes.length);

    // Перевірка, що назви рецептів відображаються
    recipes.forEach(recipe => {
      expect(screen.getByText(recipe.title)).toBeInTheDocument();
    });
  });
});
