import { useMutation } from "@tanstack/react-query";
import { registerOrganisation } from "../api/authApi";

export const useRegisterOrganisation = () => {
  return useMutation({
    mutationFn: registerOrganisation,
  });
};
