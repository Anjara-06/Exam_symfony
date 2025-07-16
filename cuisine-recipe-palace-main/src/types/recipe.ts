export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  category: RecipeCategory;
  cookingTime: number; // en minutes
  servings: number;
  difficulty: Difficulty;
  rating: number; // 0-5
  image?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type RecipeCategory = 
  | 'entrees'
  | 'plats-principaux'
  | 'desserts'
  | 'boissons'
  | 'accompagnements'
  | 'sauces';

export type Difficulty = 'facile' | 'moyen' | 'difficile';

export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  category: RecipeCategory;
  cookingTime: string;
  servings: string;
  difficulty: Difficulty;
  tags: string;
}