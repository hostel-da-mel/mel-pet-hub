import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from 'react';
import { api } from '@/services/api';

interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  setAuthenticatedUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = window.localStorage.getItem('auth_token');
      if (token) {
        try {
          const userData = await api.getCurrentUser<User>();
          if (userData) {
            setUser(userData);
          } else {
            setUser(null);
          }
        } catch (error) {
          window.localStorage.removeItem('auth_token');
          api.clearToken();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = useCallback(
    async (email: string, senha: string) => {
      const response = await api.login(email, senha);
      setUser(response.user ?? null);
    },
    [setUser]
  );

  const loginWithGoogle = useCallback(async () => {
    await api.loginWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
  }, [setUser]);

  const setAuthenticatedUser = useCallback(
    (authenticatedUser: User | null) => {
      setUser(authenticatedUser);
    },
    [setUser]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      loginWithGoogle,
      logout,
      isAuthenticated: !!user,
      setAuthenticatedUser,
    }),
    [user, loading, login, loginWithGoogle, logout, setAuthenticatedUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
