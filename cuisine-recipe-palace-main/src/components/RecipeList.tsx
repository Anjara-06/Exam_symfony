import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RecipeCard } from './RecipeCard';
import { Recipe, RecipeCategory } from '@/types/recipe';
import { Search, Filter, Plus, TrendingUp } from 'lucide-react';

interface RecipeListProps {
  recipes: Recipe[];
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onView: (recipe: Recipe) => void;
  onAdd: () => void;
}

const categories: { value: RecipeCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'entrees', label: 'Entrées' },
  { value: 'plats-principaux', label: 'Plats principaux' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'boissons', label: 'Boissons' },
  { value: 'accompagnements', label: 'Accompagnements' },
  { value: 'sauces', label: 'Sauces' }
];

type SortOption = 'recent' | 'popular' | 'time' | 'title';

export function RecipeList({ recipes, onEdit, onDelete, onView, onAdd }: RecipeListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RecipeCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  // Filtrage et tri des recettes
  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.rating - a.rating;
        case 'time':
          return a.cookingTime - b.cookingTime;
        case 'title':
          return a.title.localeCompare(b.title);
        case 'recent':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="space-y-6">
      {/* Header avec titre et bouton d'ajout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Mes Recettes
          </h1>
          <p className="text-muted-foreground mt-1">
            {recipes.length} recette{recipes.length > 1 ? 's' : ''} dans votre collection
          </p>
        </div>
        <Button onClick={onAdd} className="bg-gradient-primary hover:shadow-elegant">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle recette
        </Button>
      </div>

      {/* Barre de recherche et filtres */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Rechercher par titre, description ou tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={selectedCategory} onValueChange={(value: RecipeCategory | 'all') => setSelectedCategory(value)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <TrendingUp className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Plus récentes</SelectItem>
              <SelectItem value="popular">Plus populaires</SelectItem>
              <SelectItem value="time">Temps de préparation</SelectItem>
              <SelectItem value="title">Ordre alphabétique</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistiques rapides */}
      {searchQuery === '' && selectedCategory === 'all' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-secondary p-4 rounded-lg">
            <div className="text-2xl font-bold text-foreground">{recipes.length}</div>
            <div className="text-sm text-muted-foreground">Recettes total</div>
          </div>
          <div className="bg-gradient-accent p-4 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(recipes.reduce((acc, r) => acc + r.rating, 0) / recipes.length * 10) / 10 || 0}
            </div>
            <div className="text-sm text-muted-foreground">Note moyenne</div>
          </div>
          <div className="bg-gradient-secondary p-4 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(recipes.reduce((acc, r) => acc + r.cookingTime, 0) / recipes.length) || 0}
            </div>
            <div className="text-sm text-muted-foreground">Temps moyen (min)</div>
          </div>
          <div className="bg-gradient-accent p-4 rounded-lg">
            <div className="text-2xl font-bold text-foreground">
              {new Set(recipes.flatMap(r => r.tags)).size}
            </div>
            <div className="text-sm text-muted-foreground">Tags uniques</div>
          </div>
        </div>
      )}

      {/* Filtres actifs */}
      {(searchQuery || selectedCategory !== 'all') && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="px-3 py-1">
              Recherche: "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="px-3 py-1">
              Catégorie: {categories.find(c => c.value === selectedCategory)?.label}
              <button
                onClick={() => setSelectedCategory('all')}
                className="ml-2 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      )}

      {/* Liste des recettes */}
      {filteredAndSortedRecipes.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Aucune recette ne correspond à vos critères'
              : 'Aucune recette pour le moment'
            }
          </div>
          {(!searchQuery && selectedCategory === 'all') && (
            <Button onClick={onAdd} className="bg-gradient-primary hover:shadow-elegant">
              <Plus className="h-4 w-4 mr-2" />
              Créer votre première recette
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onEdit={onEdit}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}