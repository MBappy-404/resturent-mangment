import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !user) {
        try {
          const res = await api.getProfile();
          setUser(res.data as User);
        } catch {
          setUser(null);
          setToken(null);
          api.clearToken();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login(email, password);
    const data = res.data as { user: User; token: string };
    setUser(data.user);
    setToken(data.token);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    api.clearToken();
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
