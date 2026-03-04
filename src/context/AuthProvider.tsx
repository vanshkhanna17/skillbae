import { getUser, loginRequest, logoutRequest, refreshTokenRequest } from "@/api/authApi.ts";
import { getAccessToken } from "@/api/tokenStore.ts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, use, type ReactNode } from "react";

type AuthContextType = {
  user: object | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>(undefined!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  //refresh token query: only runs on initial load
  useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: refreshTokenRequest,
    retry: 0,
    staleTime: Infinity,
  });

  const getUserQuery = useQuery({
    queryKey: ["auth", "user"],
    queryFn: getUser,
    enabled: !!getAccessToken(),
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginRequest(username, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth", "user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => logoutRequest(),
    onSuccess: () => {
      queryClient.resetQueries({ queryKey: ["auth"] });
      queryClient.removeQueries({ queryKey: ["auth", "user"] });
    },
  });

  return (
    <AuthContext
      value={{
        user: getUserQuery.data ?? null,
        isAuthenticated: !!getUserQuery.data,
        login: async (u: string, p: string) =>
          await loginMutation.mutateAsync({ username: u, password: p }),
        logout: async () => await logoutMutation.mutateAsync(),
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => {
  const context = use(AuthContext);
  if (!context) throw new Error("userAuth must be used within AuthProvider");
  return context;
};
