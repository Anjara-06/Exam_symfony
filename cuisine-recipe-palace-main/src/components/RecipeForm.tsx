import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recipe, RecipeFormData, RecipeCategory, Difficulty } from '@/types/recipe';
import { Plus, X } from 'lucide-react';

interface RecipeFormProps {
  initialData?: Recipe;
  onSubmit: (data: RecipeFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

const categories: { value: RecipeCategory; label: string }[] = [
  { value: 'entrees', label: 'Entrées' },
  { value: 'plats-principaux', label: 'Plats principaux' },
  { value: 'desserts', label: 'Desserts' },
  { value: 'boissons', label: 'Boissons' },
  { value: 'accompagnements', label: 'Accompagnements' },
  { value: 'sauces', label: 'Sauces' }
];

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'facile', label: 'Facile' },
  { value: 'moyen', label: 'Moyen' },
  { value: 'difficile', label: 'Difficile' }
];

export function RecipeForm({ initialData, onSubmit, onCancel, isEditing = false }: RecipeFormProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    ingredients: initialData?.ingredients.join('\n') || '',
    instructions: initialData?.instructions.join('\n') || '',
    category: initialData?.category || 'plats-principaux',
    cookingTime: initialData?.cookingTime.toString() || '',
    servings: initialData?.servings.toString() || '',
    difficulty: initialData?.difficulty || 'moyen',
    tags: initialData?.tags.join(', ') || ''
  });

  const [ingredientsList, setIngredientsList] = useState<string[]>(
    initialData?.ingredients || ['']
  );
  
  const [instructionsList, setInstructionsList] = useState<string[]>(
    initialData?.instructions || ['']
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredIngredients = ingredientsList.filter(ing => ing.trim() !== '');
    const filteredInstructions = instructionsList.filter(inst => inst.trim() !== '');
    
    onSubmit({
      ...formData,
      ingredients: filteredIngredients.join('\n'),
      instructions: filteredInstructions.join('\n')
    });
  };

  const addIngredient = () => {
    setIngredientsList([...ingredientsList, '']);
  };

  const removeIngredient = (index: number) => {
    const newList = ingredientsList.filter((_, i) => i !== index);
    setIngredientsList(newList);
  };

  const updateIngredient = (index: number, value: string) => {
    const newList = [...ingredientsList];
    newList[index] = value;
    setIngredientsList(newList);
  };

  const addInstruction = () => {
    setInstructionsList([...instructionsList, '']);
  };

  const removeInstruction = (index: number) => {
    const newList = instructionsList.filter((_, i) => i !== index);
    setInstructionsList(newList);
  };

  const updateInstruction = (index: number, value: string) => {
    const newList = [...instructionsList];
    newList[index] = value;
    setInstructionsList(newList);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-hero">
        <CardTitle className="text-2xl">
          {isEditing ? 'Modifier la recette' : 'Nouvelle recette'}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de la recette *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Risotto aux champignons"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value: RecipeCategory) => setFormData({...formData, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Décrivez votre recette en quelques mots..."
              rows={3}
            />
          </div>

          {/* Détails pratiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cookingTime">Temps de préparation (min) *</Label>
              <Input
                id="cookingTime"
                type="number"
                value={formData.cookingTime}
                onChange={(e) => setFormData({...formData, cookingTime: e.target.value})}
                placeholder="35"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="servings">Nombre de portions *</Label>
              <Input
                id="servings"
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData({...formData, servings: e.target.value})}
                placeholder="4"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="difficulty">Difficulté</Label>
              <Select 
                value={formData.difficulty} 
                onValueChange={(value: Difficulty) => setFormData({...formData, difficulty: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff.value} value={diff.value}>
                      {diff.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Ingrédients */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Ingrédients *</Label>
              <Button type="button" onClick={addIngredient} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </Button>
            </div>
            
            <div className="space-y-2">
              {ingredientsList.map((ingredient, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Ingrédient ${index + 1}`}
                  />
                  {ingredientsList.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      size="sm"
                      variant="ghost"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Instructions *</Label>
              <Button type="button" onClick={addInstruction} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une étape
              </Button>
            </div>
            
            <div className="space-y-3">
              {instructionsList.map((instruction, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-1">
                    {index + 1}
                  </div>
                  <Textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`Étape ${index + 1}`}
                    rows={2}
                    className="flex-1"
                  />
                  {instructionsList.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      size="sm"
                      variant="ghost"
                      className="mt-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="végétarien, italien, champignons"
            />
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:shadow-elegant">
              {isEditing ? 'Mettre à jour' : 'Créer la recette'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}