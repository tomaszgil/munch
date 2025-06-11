import { useCallback } from "react";
import { useLocalStorageState } from "../../utils/useLocalStorageState";
import { key } from "./keys";
import type { Meal, MealCategory } from "./types";

export const useMealCreate = () => {
  const [_, setMeals] = useLocalStorageState<Meal[]>(key, []);

  const createMeal = useCallback(
    (name: string, ingredients: string[], category: MealCategory) => {
      const newMeal: Meal = {
        id: crypto.randomUUID(),
        name,
        ingredients,
        category,
      };

      setMeals((prevMeals) => [...prevMeals, newMeal]);
    },
    [setMeals]
  );

  return createMeal;
};
