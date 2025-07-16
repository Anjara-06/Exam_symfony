import { useState, useEffect } from 'react';
import { Recipe, RecipeCategory, Difficulty } from '@/types/recipe';

// Données d'exemple pour simuler une base de données
const sampleRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Risotto aux champignons',
    description: 'Un délicieux risotto crémeux aux champignons de saison',
    ingredients: [
      '300g de riz arborio',
      '400g de champignons mélangés',
      '1L de bouillon de légumes',
      '1 oignon',
      '100ml de vin blanc',
      '50g de parmesan',
      '30g de beurre',
      'Sel, poivre'
    ],
    instructions: [
      'Faire chauffer le bouillon dans une casserole',
      'Émincer l\'oignon et le faire revenir dans l\'huile',
      'Ajouter le riz et le faire nacrer 2 minutes',
      'Verser le vin blanc et laisser évaporer',
      'Ajouter le bouillon louche par louche en remuant',
      'Incorporer les champignons sautés',
      'Terminer avec le parmesan et le beurre'
    ],
    category: 'plats-principaux',
    cookingTime: 35,
    servings: 4,
    difficulty: 'moyen',
    rating: 4.5,
    tags: ['végétarien', 'italien', 'champignons'],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    title: 'Tarte au citron meringuée',
    description: 'La classique tarte au citron avec sa meringue dorée',
    ingredients: [
      '1 pâte brisée',
      '4 citrons',
      '3 œufs entiers',
      '2 jaunes d\'œufs',
      '150g de sucre',
      '80g de beurre',
      '3 blancs d\'œufs',
      '80g de sucre glace'
    ],
    instructions: [
      'Préchauffer le four à 180°C',
      'Foncer un moule avec la pâte brisée',
      'Cuire à blanc 15 minutes',
      'Préparer la crème au citron avec les œufs, le sucre et le jus de citron',
      'Verser la crème sur la pâte',
      'Monter les blancs en neige avec le sucre glace',
      'Déposer la meringue et dorer au four'
    ],
    category: 'desserts',
    cookingTime: 60,
    servings: 8,
    difficulty: 'difficile',
    rating: 4.8,
    tags: ['pâtisserie', 'citron', 'meringue'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
];

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un chargement depuis une API
    const loadRecipes = () => {
      setTimeout(() => {
        const storedRecipes = localStorage.getItem('recipes');
        if (storedRecipes) {
          setRecipes(JSON.parse(storedRecipes));
        } else {
          setRecipes(sampleRecipes);
          localStorage.setItem('recipes', JSON.stringify(sampleRecipes));
        }
        setLoading(false);
      }, 500);
    };

    loadRecipes();
  }, []);

  const saveRecipes = (newRecipes: Recipe[]) => {
    setRecipes(newRecipes);
    localStorage.setItem('recipes', JSON.stringify(newRecipes));
  };

  const addRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const updatedRecipes = [...recipes, newRecipe];
    saveRecipes(updatedRecipes);
    return newRecipe;
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    const updatedRecipes = recipes.map(recipe =>
      recipe.id === id
        ? { ...recipe, ...updates, updatedAt: new Date() }
        : recipe
    );
    saveRecipes(updatedRecipes);
  };

  const deleteRecipe = (id: string) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== id);
    saveRecipes(updatedRecipes);
  };

  const getRecipesByCategory = (category: RecipeCategory) => {
    return recipes.filter(recipe => recipe.category === category);
  };

  const searchRecipes = (query: string) => {
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description.toLowerCase().includes(query.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getPopularRecipes = () => {
    return [...recipes].sort((a, b) => b.rating - a.rating);
  };

  return {
    recipes,
    loading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipesByCategory,
    searchRecipes,
    getPopularRecipes
  };
}