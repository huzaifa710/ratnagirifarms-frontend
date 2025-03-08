"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { environment } from "@/environment";
import axios from "axios";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${environment.API_URL}/users/signin`, {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;
      console.log(response.data);
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("uuid", user.uuid);
      }
      setIsAuthenticated(true);
      setUser(user);
      router.back();
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("uuid");
    }
    window.location.reload();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        uuid:
          user?.uuid ||
          (typeof window !== "undefined" ? localStorage.getItem("uuid") : null),
        accessToken:
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
