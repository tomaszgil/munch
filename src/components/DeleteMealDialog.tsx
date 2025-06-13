import { Button, Dialog, Flex } from "@radix-ui/themes";

interface DeleteMealDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
}

export function DeleteMealDialog({
  isOpen,
  onOpenChange,
  onDelete,
}: DeleteMealDialogProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 450 }}>
        <Dialog.Title>Delete meal</Dialog.Title>
        <Dialog.Description mb="4">
          Are you sure you want to delete this meal? This action cannot be
          undone.
        </Dialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button color="red" onClick={onDelete}>
            Delete
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
