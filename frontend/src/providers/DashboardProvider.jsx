import { useState } from "react";
import { DashboardContext } from "../contexts/DashboardContext";

export default function DashboardProvider({ children }) {
  const [pageTitle, setPageTitle] = useState("");
  const [subTitle, setSubtitle] = useState("");

  return (
    <DashboardContext.Provider
      value={{
        pageTitle,
        setPageTitle,
        subTitle,
        setSubtitle,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
