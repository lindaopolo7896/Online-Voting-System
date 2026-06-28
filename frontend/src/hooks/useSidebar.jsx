import { useContext } from "react";
import { SidebarContext } from "@/app/providers/SidebarContext";

export function useSidebar() {
  return useContext(SidebarContext);
}
