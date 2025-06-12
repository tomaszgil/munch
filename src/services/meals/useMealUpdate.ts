import { useCallback } from "react";
import { store } from "./store";
import type { MealCategory } from "./types";

type MealUpdate = {
  name?: string;
  ingredients?: string[];
  category?: MealCategory;
};

export const useMealUpdate = () => {
  const updateMeal = useCallback((id: string, updates: MealUpdate) => {
    store.set(
      store.get().map((meal) =>
        meal.id === id
          ? {
              ...meal,
              ...updates,
            }
          : meal
      )
    );
  }, []);

  return updateMeal;
};
