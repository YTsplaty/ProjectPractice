// src/contexts/RecipeContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase';
import { UserContext } from './UserContext';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Прослуховування змін у колекції "recipes" для поточного користувача
  useEffect(() => {
    if (!user) {
      setRecipes([]);
      return;
    }
    const recipesCollectionRef = collection(db, 'recipes');
    const q = query(recipesCollectionRef, where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedRecipes = snapshot.docs.map((docSnap) => ({
          id: docSnap.id, // Firestore автоматично генерує id
          ...docSnap.data()
        }));
        setRecipes(fetchedRecipes);
      },
      (error) => {
        console.error('Error fetching recipes:', error);
      }
    );
    return () => unsubscribe();
  }, [user]);

  // Додавання рецепту; Firestore сам генерує id документа
  const addRecipe = useCallback(
    async (recipe) => {
      if (!user) {
        console.error('User not logged in');
        return;
      }
      const recipeWithUser = { ...recipe, userId: user.uid };
      try {
        const docRef = await addDoc(collection(db, 'recipes'), recipeWithUser);
        console.log('Recipe added successfully with id:', docRef.id);
      } catch (error) {
        console.error('Error adding recipe:', error);
      }
    },
    [user]
  );

  // Оновлення рецепту; видаляємо поле id з даних для оновлення
  const updateRecipe = useCallback(async (updatedRecipe) => {
    try {
      const { id, ...data } = updatedRecipe;
      const recipeRef = doc(db, 'recipes', id);
      await updateDoc(recipeRef, data);
      console.log('Recipe updated successfully');
    } catch (error) {
      console.error('Error updating recipe:', error);
    }
  }, []);

  // Видалення рецепту
  const deleteRecipe = useCallback(
    async (recipeId) => {
      if (!user) {
        console.error('User not logged in');
        return;
      }
      try {
        const recipeRef = doc(db, 'recipes', recipeId);
        await deleteDoc(recipeRef);
        console.log('Recipe deleted successfully');
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    },
    [user]
  );

  // Функція для встановлення пошукового запиту
  const searchRecipes = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  // Локальна фільтрація рецептів за назвою або інгредієнтами
  const filteredRecipes = recipes.filter((recipe) => {
    const lowerTerm = searchTerm.toLowerCase();
    return (
      recipe.title.toLowerCase().includes(lowerTerm) ||
      (recipe.ingredients &&
        recipe.ingredients.join(' ').toLowerCase().includes(lowerTerm))
    );
  });

  return (
    <RecipeContext.Provider
      value={{ recipes: filteredRecipes, addRecipe, updateRecipe, deleteRecipe, searchRecipes }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
