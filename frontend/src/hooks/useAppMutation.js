import { useMutation } from "@tanstack/react-query";

export const useAppMutation = ({
  mutationFn,
  onSuccess,
  onError,
  ...options
}) => {
  return useMutation({
    mutationFn,
    onSuccess,
    onError,
    ...options,
  });
};
