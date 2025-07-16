import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star, Edit, Trash2 } from 'lucide-react';
import { Recipe } from '@/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onView: (recipe: Recipe) => void;
}

const categoryLabels = {
  'entrees': 'Entrées',
  'plats-principaux': 'Plats principaux',
  'desserts': 'Desserts',
  'boissons': 'Boissons',
  'accompagnements': 'Accompagnements',
  'sauces': 'Sauces'
};

const difficultyLabels = {
  'facile': 'Facile',
  'moyen': 'Moyen',
  'difficile': 'Difficile'
};

export function RecipeCard({ recipe, onEdit, onDelete, onView }: RecipeCardProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <Card className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 
              className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors"
              onClick={() => onView(recipe)}
            >
              {recipe.title}
            </h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">
              {recipe.description}
            </p>
          </div>
          <div className="flex space-x-1 ml-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(recipe);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(recipe.id);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0" onClick={() => onView(recipe)}>
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            {categoryLabels[recipe.category]}
          </Badge>
          <Badge 
            variant="outline" 
            className={`text-xs ${
              recipe.difficulty === 'facile' ? 'border-green-500 text-green-700' :
              recipe.difficulty === 'moyen' ? 'border-yellow-500 text-yellow-700' :
              'border-red-500 text-red-700'
            }`}
          >
            {difficultyLabels[recipe.difficulty]}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookingTime} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} pers.</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {renderStars(recipe.rating)}
            <span className="ml-1 font-medium">{recipe.rating.toFixed(1)}</span>
          </div>
        </div>

        {recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs bg-accent/20">
                {tag}
              </Badge>
            ))}
            {recipe.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{recipe.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}