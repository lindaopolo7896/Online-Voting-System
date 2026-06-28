import { useState } from "react";
import { SidebarContext } from "@/app/providers/SidebarContext";

export function SidebarProvider({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}
