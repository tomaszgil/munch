import { useState } from "react";
import { toast } from "sonner";
import { Box, Card, Flex, Heading, Text, Button } from "@radix-ui/themes";
import { createFileRoute } from "@tanstack/react-router";
import { useMealsQuery } from "@/services/meals/useMealsQuery";
import { useMealsReset } from "@/services/meals/useMealsReset";
import { store } from "@/services/meals/store";
import { parseMeal } from "@/services/meals/parse";
import { DeleteAllMealsDialog } from "@/components/DeleteAllMealsDialog";

export const Route = createFileRoute("/advanced/")({
  component: Advanced,
});

function Advanced() {
  const meals = useMealsQuery();
  const resetMeals = useMealsReset();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleExport = () => {
    const dataStr = JSON.stringify(meals, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = "munch.json";
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Meals exported successfully to munch.json file.");
  };

  const handleDeleteAll = () => {
    resetMeals();
    setIsDeleteDialogOpen(false);
    toast.success("All meals have been deleted.");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsedData = JSON.parse(content);

          // Validate that the parsed data is an array
          if (!Array.isArray(parsedData)) {
            throw new Error("File must contain an array of meals");
          }

          // Validate each meal using the schema
          const validatedMeals = parsedData.map((meal, index) => {
            try {
              return parseMeal(meal);
            } catch (error) {
              throw new Error(`Invalid meal at index ${index}`);
            }
          });

          // Store the validated meals
          store.set(validatedMeals);
          toast.success(
            `Successfully imported ${validatedMeals.length} meals.`
          );
        } catch (error) {
          toast.error(
            `Import failed: ${error instanceof Error ? error.message : "Invalid file format"}`
          );
        }
      };

      reader.readAsText(file);
    };

    input.click();
  };

  return (
    <Box maxWidth="960px" mx="auto">
      <Heading as="h1" size="6" mt="4" mb="5">
        Advanced
      </Heading>

      <Flex direction="column" gap="4">
        <Card size="3">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">
              Export Meals
            </Heading>
            <Text size="2" color="gray" mb="4">
              Export all your meals to a JSON file. This will create a backup of
              your current meal database.
            </Text>
            <Box>
              <Button onClick={handleExport}>Export meals</Button>
            </Box>
          </Flex>
        </Card>

        <Card size="3">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">
              Import Meals
            </Heading>
            <Text size="2" color="gray" mb="4">
              Import meals from a JSON file. This will replace all existing
              meals with the imported data. Make sure the file contains valid
              meal data.
            </Text>
            <Box>
              <Button onClick={handleImport}>Import meals</Button>
            </Box>
          </Flex>
        </Card>

        <Card size="3">
          <Flex direction="column" gap="2">
            <Heading as="h2" size="4">
              Delete All Meals
            </Heading>
            <Text size="2" color="gray" mb="4">
              Permanently delete all meals from your database. This action
              cannot be undone.
            </Text>
            <Box>
              <Button color="red" onClick={() => setIsDeleteDialogOpen(true)}>
                Delete all meals
              </Button>
            </Box>
          </Flex>
        </Card>
      </Flex>

      <DeleteAllMealsDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDeleteAll}
      />
    </Box>
  );
}
