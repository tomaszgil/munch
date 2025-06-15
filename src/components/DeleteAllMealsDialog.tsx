import { Button, Dialog, Flex } from "@radix-ui/themes";

interface DeleteAllMealsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export function DeleteAllMealsDialog({
  isOpen,
  onOpenChange,
  onDelete,
}: DeleteAllMealsDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Delete all meals</Dialog.Title>
        <Dialog.Description mb="4">
          Are you sure you want to delete all meals? This action cannot be
          undone.
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button color="red" onClick={onDelete}>
            Delete All
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
