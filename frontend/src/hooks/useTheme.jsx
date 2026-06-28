import { useContext } from "react";
import { ThemeContext } from "@/app/providers/ThemeContext";

export default function useTheme() {
  return useContext(ThemeContext);
}
