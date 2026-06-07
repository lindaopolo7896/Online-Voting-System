import { useAppMutation } from "../../hooks/useAppMutation";
import { login } from "../../apis/authApi";

export const useLogin = () => {
  return useAppMutation({
    mutationFn: login,
  });
};
