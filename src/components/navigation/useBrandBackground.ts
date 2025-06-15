import { useTheme } from "../theme/ThemeContext";

export const useBrandBackground = () => {
  const [theme] = useTheme();

  if (theme === "dark") {
    return {
      background:
        "radial-gradient(16rem 100% at 6.64% 0, #531572 0, #532a5e 42.5%, #2f222d 100%)",
    };
  }

  return {
    background:
      "radial-gradient(16rem 100% at 6.64% 0, #f4deff 0, #fbedff 42.5%, #fdf6fc 100%)",
  };
};
