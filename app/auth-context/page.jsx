"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { environment } from "@/environment";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }

      const response = await axios.post(
        `${environment.API_URL}/users/auth-verify`,
        { accessToken: accessToken }
      );

      if (response.data.success == true) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        await signInUsingToken(accessToken, refreshToken);
      }
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem("accessToken");
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${environment.API_URL}/users/signin`, {
        email,
        password,
      });

      const { accessToken, refreshToken, user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("uuid", user.uuid);
      setIsAuthenticated(true);
      setUser(user);
      return true;
    } catch (error) {
      return false;
    }
  };

  const signInUsingToken = async (accessToken, refreshToken) => {
    try {
      const response = await axios.post(
        `${environment.API_URL}/users/sign-in-using-token`,
        {
          accessToken,
          refreshToken,
        }
      );

      if (response.data.success == true) {
        const { accessToken, refreshToken, user } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("uuid", user.uuid);
        setIsAuthenticated(true);
        setUser(user);
      } else {
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("uuid");
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("uuid");
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
