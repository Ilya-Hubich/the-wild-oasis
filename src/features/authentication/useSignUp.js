import { useMutation } from "@tanstack/react-query";
import { signUp as signUpApi } from "../../services/apiAuth";

export function useSignUp() {
  const { isLoading, mutate: signUp } = useMutation({
    mutationFn: signUpApi,
  });

  return { isLoading, signUp };
}
