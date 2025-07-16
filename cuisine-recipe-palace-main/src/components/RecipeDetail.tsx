import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Clock, Users, Star, ArrowLeft, Edit } from 'lucide-react';
import { Recipe } from '@/types/recipe';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  onEdit: (recipe: Recipe) => void;
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

export function RecipeDetail({ recipe, onBack, onEdit }: RecipeDetailProps) {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux recettes
        </Button>
        <Button onClick={() => onEdit(recipe)} className="bg-gradient-primary hover:shadow-elegant">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </div>

      {/* En-tête de la recette */}
      <Card className="bg-gradient-hero">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
            <div className="flex-1">
              <CardTitle className="text-3xl font-bold mb-2">{recipe.title}</CardTitle>
              <p className="text-lg text-muted-foreground mb-4">{recipe.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {categoryLabels[recipe.category]}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={`text-sm ${
                    recipe.difficulty === 'facile' ? 'border-green-500 text-green-700' :
                    recipe.difficulty === 'moyen' ? 'border-yellow-500 text-yellow-700' :
                    'border-red-500 text-red-700'
                  }`}
                >
                  {difficultyLabels[recipe.difficulty]}
                </Badge>
              </div>

              <div className="flex items-center space-x-6 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">{recipe.cookingTime} minutes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="font-medium">{recipe.servings} personnes</span>
                </div>
                <div className="flex items-center space-x-2">
                  {renderStars(recipe.rating)}
                  <span className="font-medium ml-1">{recipe.rating.toFixed(1)}/5</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ingrédients */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Ingrédients</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full w-6 h-6 flex items-center justify-center text-primary text-sm font-medium mt-0.5">
                    {index + 1}
                  </div>
                  <span className="flex-1">{ingredient}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {recipe.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mt-0.5">
                    {index + 1}
                  </div>
                  <span className="flex-1 leading-relaxed">{instruction}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      {/* Tags */}
      {recipe.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="bg-accent/20">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations supplémentaires */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-1">
            <p>Créée le : {recipe.createdAt.toLocaleDateString('fr-FR')}</p>
            {recipe.updatedAt.getTime() !== recipe.createdAt.getTime() && (
              <p>Modifiée le : {recipe.updatedAt.toLocaleDateString('fr-FR')}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}