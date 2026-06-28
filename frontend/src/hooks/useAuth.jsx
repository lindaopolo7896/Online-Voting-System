import { useContext } from "react";
import { AuthContext } from "@/app/providers/AuthContext";

function useAuth() {
  return useContext(AuthContext);
}

export default useAuth;
