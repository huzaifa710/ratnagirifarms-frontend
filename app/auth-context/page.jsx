"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { environment } from "@/environment";
import axios from "axios";
import { useRouter } from "next/navigation";
import AuthModal from "@/app/otp/page";
const AuthContext = createContext();
import { getCartFromCookie, setCartCookie } from "@/utils/cookies";
import api from "@/utils/axios";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  const transferGuestCart = async (uuid, accessToken) => {
    try {
      debugger;
      const guestCart = getCartFromCookie();
      if (guestCart && guestCart.length > 0) {
        // Send only product_variant_id and quantity
        const cartItems = guestCart.map((item) => ({
          product_variant_id: item.product_variant_id,
          quantity: item.quantity,
        }));

        const response = await axios.post(
          "/carts/transfer",
          {
            uuid,
            cartItems,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setCartCookie([]); // Clear the cookie cart
      }
    } catch (error) {
      console.error("Error transferring guest cart:", error);
    }
  };

  const handleAuthSuccess = async (data) => {
    const { accessToken, refreshToken, user } = data;
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("uuid", user.uuid);
    }
    setIsAuthenticated(true);
    setUser(user);

    // Transfer cart with new credentials
    await transferGuestCart(user.uuid, accessToken);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__AUTH_CONTEXT__ = {
        setShowAuthModal,
      };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        logout,
        showAuthModal,
        setShowAuthModal,
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
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
