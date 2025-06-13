import type { MealCategory, MealCreate } from "@/services/meals/types";
import { Button, Dialog } from "@radix-ui/themes";
import { UpdateMealForm } from "./UpdateMealForm";

interface CreateMealDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (meal: MealCreate) => void;
}

export function CreateMealDialog({
  isOpen,
  onOpenChange,
  onSave,
}: CreateMealDialogProps) {
  const handleSubmit = (formData: {
    name: string;
    category: MealCategory;
    ingredients: string[];
  }) => {
    onSave(formData);
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Add new meal</Dialog.Title>
        <Dialog.Description mb="4">
          Add a new meal to your list.
        </Dialog.Description>
        <UpdateMealForm onSubmit={handleSubmit}>
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
