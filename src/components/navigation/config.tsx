import { DashboardIcon, FileTextIcon, GearIcon } from "@radix-ui/react-icons";

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
    label: "Advanced",
    icon: <GearIcon />,
    to: "/advanced",
  },
];
