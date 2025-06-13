import type { Meal } from "./types";

const key = "v1/meals";

let resultString: string = "";
let resultParsed: Array<Meal> = [];

export const store = {
  subscribe: (callback: () => void) => {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
  },
  get: () => {
    // TODO: Add type validation
    const storedString = localStorage.getItem(key) || "";
    if (storedString !== resultString) {
      resultParsed = storedString
        ? (JSON.parse(storedString) as Array<Meal>)
        : [];
      resultString = storedString;
    }
    return resultParsed;
  },
  set: (value: Array<Meal>) => {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("storage"));
  },
  delete: (id: string) => {
    const deletedMeal = resultParsed.find((meal) => meal.id === id);
    const updatedMeals = resultParsed.filter((meal) => meal.id !== id);
    store.set(updatedMeals);
    return deletedMeal;
  },
  update: (id: string, updates: Partial<Meal>) => {
    const updatedMeals = resultParsed.map((meal) =>
      meal.id === id ? { ...meal, ...updates } : meal
    );
    store.set(updatedMeals);
    return updatedMeals;
  },
  create: (meal: Meal) => {
    const updatedMeals = [...resultParsed, meal];
    store.set(updatedMeals);
    return meal;
  },
};
