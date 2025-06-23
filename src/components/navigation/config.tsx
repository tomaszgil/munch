import {
  DashboardIcon,
  FileTextIcon,
  GearIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";

export const navConfig = [
  {
    label: "Dashboard",
    icon: <DashboardIcon />,
    to: "/",
  },
  {
    label: "Meals",
    icon: <FileTextIcon />,
    to: "/meals",
  },
  {
    label: "Generate",
    icon: <MagicWandIcon />,
    to: "/generate",
  },
  {
    label: "Advanced",
    icon: <GearIcon />,
    to: "/advanced",
  },
];
