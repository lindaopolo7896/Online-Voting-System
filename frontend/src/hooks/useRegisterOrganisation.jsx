import { useMutation } from "@tanstack/react-query";
import { registerOrganisation } from "@/features/auth/api";

export const useRegisterOrganisation = () => {
  return useMutation({
    mutationFn: registerOrganisation,
  });
};
