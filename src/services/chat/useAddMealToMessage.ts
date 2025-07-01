import { useCallback } from "react";

import { store } from "./store";

export const useAddMealToMessage = () => {
  const addMealToMessage = useCallback(
    (id: string, meal: { index: number; id: string }) => {
      return store.update(id, {
        meals: [meal, ...(store.getById(id)?.meals ?? [])],
      });
    },
    []
  );

  return addMealToMessage;
};
