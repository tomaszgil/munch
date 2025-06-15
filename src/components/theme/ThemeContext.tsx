import { Theme } from "@radix-ui/themes";
import { createContext, useContext, useState, type ReactNode } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<[Theme, (theme: Theme) => void] | undefined>(
  undefined
);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  return (
    <ThemeContext.Provider value={[theme, setTheme] as const}>
      <Theme
        appearance={theme}
        accentColor="plum"
        grayColor="sand"
        radius="large"
      >
        {children}
      </Theme>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
