import { useState } from 'react';
import { RecipeList } from '@/components/RecipeList';
import { RecipeForm } from '@/components/RecipeForm';
import { RecipeDetail } from '@/components/RecipeDetail';
import { useRecipes } from '@/hooks/useRecipes';
import { Recipe, RecipeFormData } from '@/types/recipe';
import { useToast } from '@/hooks/use-toast';

type ViewMode = 'list' | 'form' | 'detail';

const Index = () => {
  const { recipes, loading, addRecipe, updateRecipe, deleteRecipe } = useRecipes();
  const { toast } = useToast();
  
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);

  const handleAddRecipe = () => {
    setEditingRecipe(null);
    setViewMode('form');
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setViewMode('form');
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setViewMode('detail');
  };

  const handleDeleteRecipe = (id: string) => {
    const recipe = recipes.find(r => r.id === id);
    if (recipe && window.confirm(`Êtes-vous sûr de vouloir supprimer "${recipe.title}" ?`)) {
      deleteRecipe(id);
      toast({
        title: "Recette supprimée",
        description: `"${recipe.title}" a été supprimée avec succès.`,
      });
    }
  };

  const handleFormSubmit = (data: RecipeFormData) => {
    try {
      // Convertir les données du formulaire
      const recipeData = {
        title: data.title,
        description: data.description,
        ingredients: data.ingredients.split('\n').filter(i => i.trim() !== ''),
        instructions: data.instructions.split('\n').filter(i => i.trim() !== ''),
        category: data.category,
        cookingTime: parseInt(data.cookingTime),
        servings: parseInt(data.servings),
        difficulty: data.difficulty,
        rating: editingRecipe?.rating || 0,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      };

      if (editingRecipe) {
        updateRecipe(editingRecipe.id, recipeData);
        toast({
          title: "Recette modifiée",
          description: `"${data.title}" a été mise à jour avec succès.`,
        });
      } else {
        addRecipe(recipeData);
        toast({
          title: "Recette créée",
          description: `"${data.title}" a été ajoutée à votre collection.`,
        });
      }
      setViewMode('list');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive",
      });
    }
  };

  const handleFormCancel = () => {
    setEditingRecipe(null);
    setViewMode('list');
  };

  const handleBackToList = () => {
    setSelectedRecipe(null);
    setViewMode('list');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de vos recettes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {viewMode === 'list' && (
          <RecipeList
            recipes={recipes}
            onAdd={handleAddRecipe}
            onEdit={handleEditRecipe}
            onView={handleViewRecipe}
            onDelete={handleDeleteRecipe}
          />
        )}
        
        {viewMode === 'form' && (
          <RecipeForm
            initialData={editingRecipe || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
            isEditing={!!editingRecipe}
          />
        )}
        
        {viewMode === 'detail' && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={handleBackToList}
            onEdit={handleEditRecipe}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
