import { useCallback } from "react";
import { store } from "./store";
import type { MealUpdate } from "./types";

export const useMealUpdate = () => {
  const updateMeal = useCallback((id: string, updates: MealUpdate) => {
    const now = new Date().toISOString();
    return store.update(id, { ...updates, updatedAt: now });
  }, []);

  return updateMeal;
};
