import { useCallback } from "react";
import { store } from "./store";
import type { Meal } from "./types";

export const useMealCreate = () => {
  const createMeal = useCallback((meal: Omit<Meal, "id">) => {
    const newMeal: Meal = {
      id: crypto.randomUUID(),
      name: meal.name,
      ingredients: meal.ingredients,
      category: meal.category,
    };

    store.set([...store.get(), newMeal]);
  }, []);

  return createMeal;
};
