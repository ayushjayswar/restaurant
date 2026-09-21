import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null); // { message, type }

  // Page refresh hone par bhi login bana rahe, isliye localStorage se restore karo
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Action se pehle login check karne ke liye - agar login nahi hai to false return karega
  const requireAuth = (navigate) => {
    if (!user) {
      showToast("Pehle login ya signup karo!", "error");
      navigate("/login");
      return false;
    }
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, toast, showToast, requireAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth ko AuthProvider ke andar hi use karo");
  }
  return ctx;
}