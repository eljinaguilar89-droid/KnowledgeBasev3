import React, { createContext, useContext, useState, useEffect } from "react";

type Role =
  | "NEO"
  | "DevOps Engineer"
  | "DevOps & Infra Manager"
  | "Sec & Comp. Manager"
  | "IED Head";

type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  apiKey?: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("ied_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("ied_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ied_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
