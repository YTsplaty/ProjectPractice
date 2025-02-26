// src/components/RecipeForm.jsx
import React, { useState, useContext } from 'react';
import { RecipeContext } from '../../contexts/RecipeContext';
import { ClipLoader } from 'react-spinners';

const RecipeForm = () => {
  const { addRecipe } = useContext(RecipeContext);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !body.trim()) {
      setErrorMessage('Будь ласка, заповніть обовʼязкові поля');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const newRecipe = {
      title: title.trim(),
      body: body.trim(),
      ingredients: ingredients
        ? ingredients.split(',').map(item => item.trim()).filter(Boolean)
        : []
    };

    try {
      await addRecipe(newRecipe);
      setTitle('');
      setBody('');
      setIngredients('');
    } catch (error) {
      setErrorMessage('Сталася помилка при додаванні рецепту');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-auto max-w-3xl p-4 border rounded shadow mb-4 mt-8 relative">
      <h2 className="text-lg font-bold mb-4">Додати новий рецепт</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Назва рецепту *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-400"
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-4">
        <textarea
          placeholder="Опис/інструкції *"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-400 h-32"
          disabled={isSubmitting}
        />
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Інгредієнти (через кому)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="p-2 border rounded w-full focus:ring-2 focus:ring-blue-400"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-500 text-white p-2 m-auto cursor-pointer rounded hover:bg-blue-600 disabled:bg-blue-300 transition-all duration-200 w-32 h-10 flex items-center justify-center"
      >
        {isSubmitting ? (
          <ClipLoader color="#ffffff" size={20} speedMultiplier={0.75} />
        ) : (
          'Додати рецепт'
        )}
      </button>
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg animate-fade-in">
          {errorMessage}
        </div>
      )}
    </form>
  );
};

export default RecipeForm;
