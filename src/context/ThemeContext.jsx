import { createContext, useContext } from "react";

// 1. Create and export the context itself
export const ThemeContext = createContext();

// 2. Create and export the custom hook
export const useTheme = () => useContext(ThemeContext);