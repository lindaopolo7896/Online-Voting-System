import { useContext } from "react";
import { SidebarContext } from "../contexts/SidebarContext";

export function useSidebar() {
  return useContext(SidebarContext);
}
