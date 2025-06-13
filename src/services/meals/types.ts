export type MealCategory = "breakfast" | "lunch" | "dinner" | "snack";

export type Meal = {
  id: string;
  name: string;
  ingredients: Array<string>;
  category: MealCategory;
  createdAt: string;
  updatedAt: string;
};

export type MealCreate = Omit<Meal, "id" | "createdAt" | "updatedAt">;
export type MealUpdate = Partial<Omit<Meal, "id" | "createdAt" | "updatedAt">>;
