import { useRef } from "react";
import type { Meal, MealCategory, MealUpdate } from "@/services/meals/types";
import { Button, Dialog } from "@radix-ui/themes";
import { UpdateMealForm } from "./UpdateMealForm";

interface UpdateMealDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, meal: MealUpdate) => void;
  meal: Meal;
}

export function UpdateMealDialog({
  isOpen,
  onOpenChange,
  onSave,
  meal: mealToUpdate,
}: UpdateMealDialogProps) {
  // Preserve the meal object reference across re-renders.
  // This allows to avoid re-rendering when the dialog is closed.
  const mealRef = useRef(mealToUpdate);
  const meal = mealRef.current;

  const handleSubmit = (formData: {
    name: string;
    category: MealCategory;
    ingredients: string[];
  }) => {
    onSave(meal.id, formData);
    onOpenChange(false);
  };

  const defaultValues = {
    name: meal?.name,
    category: meal?.category,
    ingredients: meal?.ingredients,
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Edit meal</Dialog.Title>
        <Dialog.Description mb="4">Update meal details.</Dialog.Description>
        <UpdateMealForm defaultValues={defaultValues} onSubmit={handleSubmit}>
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button type="submit">Save</Button>
        </UpdateMealForm>
      </Dialog.Content>
    </Dialog.Root>
  );
}
