<?php
// src/Controller/ApiRecipeController.php

namespace App\Controller;

use App\Entity\Recipe;
use App\Repository\RecipeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ApiRecipeController extends AbstractController
{
    #[Route('/api/recipes', name: 'api_recipes_list', methods: ['GET'])]
    public function list(RecipeRepository $recipeRepository): JsonResponse
    {
        $recipes = $recipeRepository->findAll();

        $data = array_map(function (Recipe $recipe) {
            return [
                'id' => $recipe->getId(),
                'title' => $recipe->getTitle(),
                'ingredients' => $recipe->getIngredients(),
                'instructions' => $recipe->getInstructions(),
                'category' => $recipe->getCategory(),
                'popularity' => $recipe->getPopularity(),
            ];
        }, $recipes);

        return $this->json($data);
    }

    #[Route('/api/recipes', name: 'api_recipes_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['title'], $data['ingredients'], $data['instructions'])) {
            return $this->json(['error' => 'Missing data'], 400);
        }

        $recipe = new Recipe();
        $recipe->setTitle($data['title']);
        $recipe->setIngredients($data['ingredients']);
        $recipe->setInstructions($data['instructions']);
        $recipe->setCategory($data['category'] ?? null);
        $recipe->setPopularity($data['popularity'] ?? 0);

        $em->persist($recipe);
        $em->flush();

        return $this->json(['message' => 'Recipe created', 'id' => $recipe->getId()], 201);
    }

    #[Route('/api/recipes/{id}', name: 'api_recipes_update', methods: ['PUT'])]
    public function update(int $id, Request $request, RecipeRepository $recipeRepository, EntityManagerInterface $em): JsonResponse
    {
        $recipe = $recipeRepository->find($id);
        if (!$recipe) {
            return $this->json(['error' => 'Recipe not found'], 404);
        }

        $data = json_decode($request->getContent(), true);

        if (isset($data['title'])) {
            $recipe->setTitle($data['title']);
        }
        if (isset($data['ingredients'])) {
            $recipe->setIngredients($data['ingredients']);
        }
        if (isset($data['instructions'])) {
            $recipe->setInstructions($data['instructions']);
        }
        if (isset($data['category'])) {
            $recipe->setCategory($data['category']);
        }
        if (isset($data['popularity'])) {
            $recipe->setPopularity($data['popularity']);
        }

        $em->flush();

        return $this->json(['message' => 'Recipe updated']);
    }

    #[Route('/api/recipes/{id}', name: 'api_recipes_delete', methods: ['DELETE'])]
    public function delete(int $id, RecipeRepository $recipeRepository, EntityManagerInterface $em): JsonResponse
    {
        $recipe = $recipeRepository->find($id);
        if (!$recipe) {
            return $this->json(['error' => 'Recipe not found'], 404);
        }

        $em->remove($recipe);
        $em->flush();

        return $this->json(['message' => 'Recipe deleted']);
    }

    #[Route('/api/recipes/{id}', name: 'api_recipes_show', methods: ['GET'])]
    public function show(int $id, RecipeRepository $recipeRepository): JsonResponse
    {
        $recipe = $recipeRepository->find($id);
        if (!$recipe) {
            return $this->json(['error' => 'Recipe not found'], 404);
        }

        $data = [
            'id' => $recipe->getId(),
            'title' => $recipe->getTitle(),
            'ingredients' => $recipe->getIngredients(),
            'instructions' => $recipe->getInstructions(),
            'category' => $recipe->getCategory(),
            'popularity' => $recipe->getPopularity(),
        ];

        return $this->json($data);
    }
}
