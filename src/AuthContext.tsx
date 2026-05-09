import React, { createContext, useContext, useState, useEffect } from "react";

type Role = "Viewer" | "Author" | "Approver" | "Admin";

type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
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
    const stored = localStorage.getItem("psbank_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem("psbank_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("psbank_user");
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
