import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "auth_user";
const TOKEN_KEY = "access_token";

const API_URL = "https://lcd-dressing-jim-oven.trycloudflare.com/";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);

  // Page refresh hone par login + token restore karo
  useEffect(() => {
    const storedUser = localStorage.getItem(STORAGE_KEY);
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  // Backend se login hone ke baad ye function call hoga
  const login = (userData, token) => {
    setUser(userData);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(userData)
    );

    localStorage.setItem(TOKEN_KEY, token);
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  // JWT token kisi protected API me bhejne ke liye
  const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };

  // Protected API call ke liye helper
  const authFetch = async (endpoint, options = {}) => {
    const token = getToken();

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  };

  // Login required action
  const requireAuth = (navigate) => {
    if (!user) {
      showToast(
        "Pehle login ya signup karo!",
        "error"
      );

      navigate("/login");
      return false;
    }

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        toast,
        showToast,
        requireAuth,
        getToken,
        authFetch,
        API_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth ko AuthProvider ke andar hi use karo"
    );
  }

  return ctx;
}
