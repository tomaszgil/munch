import { useCallback } from "react";
import { store } from "./store";
import type { MealUpdate } from "./types";

export const useMealUpdate = () => {
  const updateMeal = useCallback((id: string, updates: MealUpdate) => {
    const now = new Date().toISOString();

    store.set(
      store.get().map((meal) =>
        meal.id === id
          ? {
              ...meal,
              ...updates,
              updatedAt: now,
            }
          : meal
      )
    );
  }, []);

  return updateMeal;
};
