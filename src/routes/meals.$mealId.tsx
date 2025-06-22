import { useState } from "react";
import { toast } from "sonner";
import {
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  DataList,
  Button,
  Separator,
} from "@radix-ui/themes";
import {
  createFileRoute,
  useCanGoBack,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useMealQuery } from "@/services/meals/useMealQuery";
import { useMealDelete } from "@/services/meals/useMealDelete";
import { useMealUpdate } from "@/services/meals/useMealUpdate";
import { ChevronLeftIcon, Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { CategoryBadge } from "@/components/CategoryBadge";
import { UpdateMealDialog } from "@/components/UpdateMealDialog";
import { DeleteMealDialog } from "@/components/DeleteMealDialog";

export const Route = createFileRoute("/meals/$mealId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { mealId } = Route.useParams();
  const navigate = useNavigate();
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const meal = useMealQuery(mealId);
  const deleteMeal = useMealDelete();
  const updateMeal = useMealUpdate();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // TODO: Add an error state
  if (!meal) {
    return <div>Meal not found</div>;
  }

  const navigateToMeals = () => {
    navigate({
      to: "/meals",
      search: { category: "all", search: "" },
    });
  };

  const handleDelete = () => {
    const deletedMeal = deleteMeal(mealId);
    setIsDeleteDialogOpen(false);
    toast.success(`You have deleted ${deletedMeal?.name}.`);
    navigateToMeals();
  };

  const handleUpdate = (id: string, mealUpdate: any) => {
    const updatedMeal = updateMeal(id, mealUpdate);
    setIsEditDialogOpen(false);
    toast.success(`You have updated ${updatedMeal?.name}.`);
  };

  return (
    <>
      <Box maxWidth="960px" mx="auto">
        <Flex align="center" mt="3" mb="5" gap="3">
          <IconButton
            variant="ghost"
            color="gray"
            size="1"
            onClick={() =>
              canGoBack ? router.history.back() : navigateToMeals()
            }
          >
            <ChevronLeftIcon width={24} height={24} />
          </IconButton>
          <Heading as="h1" size="6" truncate>
            {meal?.name}
          </Heading>
        </Flex>
        <Card size="3">
          <Flex mb="4" gap="4">
            <Button
              variant="soft"
              color="gray"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil1Icon />
              Edit
            </Button>
            <Button
              variant="soft"
              color="red"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <TrashIcon />
              Delete
            </Button>
          </Flex>
          <Separator orientation="horizontal" size="4" my="5" />

          <DataList.Root>
            <DataList.Item>
              <DataList.Label>Name</DataList.Label>
              <DataList.Value>{meal.name}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Category</DataList.Label>
              <DataList.Value>
                <CategoryBadge category={meal.category} />
              </DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label>Ingredients</DataList.Label>
              <DataList.Value>
                <ol style={{ margin: 0, paddingLeft: "1rem" }}>
                  {meal.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}
                </ol>
              </DataList.Value>
            </DataList.Item>
          </DataList.Root>
        </Card>
      </Box>

      <UpdateMealDialog
        key={meal.id}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleUpdate}
        meal={meal}
      />

      <DeleteMealDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onDelete={handleDelete}
      />
    </>
  );
}
