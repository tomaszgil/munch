import { Button, Dialog, Flex } from "@radix-ui/themes";

import type { MealCreate } from "@/services/meals/types";

import { MealDetails } from "./MealDetails";

interface MealSuggestionDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  meal: MealCreate;
  onAddToMenu: () => void;
}

export function MealSuggestionDetailsDialog({
  isOpen,
  onOpenChange,
  meal,
  onAddToMenu,
}: MealSuggestionDetailsDialogProps) {
  const handleAddToMenu = () => {
    onAddToMenu();
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Meal Details Suggestion</Dialog.Title>
        <Dialog.Description mb="5">
          View the details of this meal suggestion.
        </Dialog.Description>

        <MealDetails meal={meal} />

        <Flex gap="3" mt="5" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
          <Button onClick={handleAddToMenu}>Add to menu</Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
