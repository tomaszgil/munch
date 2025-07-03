import { useCallback } from "react";
import { store } from "./store";
import type { Meal, MealCreate } from "./types";

export const useMealCreate = () => {
  const createMeal = useCallback((meal: MealCreate) => {
    const now = new Date().toISOString();
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      name: meal.name,
      ingredients: meal.ingredients,
      category: meal.category,
      favorite: false,
      createdAt: now,
      updatedAt: now,
    };

    return store.create(newMeal);
  }, []);

  return createMeal;
};
