import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
          const userData = await api.getCurrentUser() as User;
          setUser(userData);
        } catch (error) {
          window.localStorage.removeItem('auth_token');
          api.clearToken();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email: string, senha: string) => {
    const response = await api.login(email, senha);
    setUser(response.user ?? null);
  };

  const loginWithGoogle = async () => {
    await api.loginWithGoogle();
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const setAuthenticatedUser = (authenticatedUser: User | null) => {
    setUser(authenticatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        logout,
        isAuthenticated: !!user,
        setAuthenticatedUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
