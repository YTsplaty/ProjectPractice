// src/components/Recipe.jsx
import React, { useState } from 'react';

const Recipe = ({ recipe, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(recipe.title);
  const [editedBody, setEditedBody] = useState(recipe.body);
  const [editedIngredients, setEditedIngredients] = useState(
    recipe.ingredients ? recipe.ingredients.join(', ') : ''
  );
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = () => {
    if (!editedTitle.trim() || !editedBody.trim()) {
      setErrorMessage('Назва та опис є обовʼязковими');
      return;
    }
    
    const updatedRecipe = {
      ...recipe,
      title: editedTitle.trim(),
      body: editedBody.trim(),
      // Перетворюємо рядок інгредієнтів у масив
      ingredients: editedIngredients
        ? editedIngredients.split(',').map(item => item.trim()).filter(Boolean)
        : []
    };

    onUpdate(updatedRecipe);
    setErrorMessage('');
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(recipe.title);
    setEditedBody(recipe.body);
    setEditedIngredients(recipe.ingredients ? recipe.ingredients.join(', ') : '');
    setErrorMessage('');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="border rounded p-4 shadow hover:shadow-lg transition duration-200">
        <input
          type="text"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="text-xl font-bold mb-2 w-full p-1 border rounded focus:ring-2 focus:ring-blue-400"
          placeholder="Назва рецепту *"
        />
        <textarea
          value={editedBody}
          onChange={(e) => setEditedBody(e.target.value)}
          className="mb-2 w-full p-1 border rounded focus:ring-2 focus:ring-blue-400 h-24"
          placeholder="Опис/інструкції *"
        />
        <input
          type="text"
          value={editedIngredients}
          onChange={(e) => setEditedIngredients(e.target.value)}
          className="mb-2 w-full p-1 border rounded focus:ring-2 focus:ring-blue-400"
          placeholder="Інгредієнти (через кому)"
        />
        {errorMessage && (
          <div className="mb-2 p-2 bg-red-100 text-red-700 rounded">
            {errorMessage}
          </div>
        )}
        <div className="flex space-x-2 justify-center">
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 cursor-pointer"
          >
            ✅
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 cursor-pointer"
            
          >
            ✖
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded p-4 shadow hover:shadow-lg transition duration-200 relative">
      <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
      <p className="text-gray-700">{recipe.body}</p>
      {recipe.ingredients && (
        <ul className="mt-2 list-disc list-inside">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      )}
      <div className="absolute top-0 right-5 mt-4 flex space-x-2">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 cursor-pointer"
        >
         ✏️
        </button>
        <button
          onClick={() => onDelete(recipe.id)}
          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default Recipe;
