import React, { useContext } from 'react';
import { RecipeContext } from '../../contexts/RecipeContext';
import RecipeCard from '../RecipeCard/RecipeCard';

const RecipeList = () => {
    const { recipes, searchRecipes, updateRecipe, deleteRecipe } = useContext(RecipeContext);

    return (
        <div className="p-4 container flex justify-center flex-col object-center">
            <input
                type="text"
                placeholder="Пошук рецептів..."
                className="mb-4 mx-auto p-2 border rounded w-full max-w-2xl "
                onChange={(e) => searchRecipes(e.target.value)}
            />

            {
                !recipes.length ?
                    <h2 className='mx-auto text-2xl' >Поки немає рецептів</h2>
                    :
                    (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} onUpdate={updateRecipe} onDelete={deleteRecipe} />
                            ))}
                        </div>
                    )
            }
        </div>
    );
};

export default RecipeList;
