"use client";
import { createContext, useContext, useState, useEffect } from "react";
import api from "@/utils/axios";
import AuthModal from "@/app/otp/page";
const AuthContext = createContext();
import { getCartFromCookie, setCartCookie } from "@/utils/cookies";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("uuid");
      localStorage.removeItem("mobile");
    }
    window.location.reload();
    setUser(null);
  };

  const transferGuestCart = async (uuid, accessToken) => {
    try {
      const guestCart = getCartFromCookie();
      if (guestCart && guestCart.length > 0) {
        const response = await api.post(
          "/carts/transfer",
          {
            uuid,
            cartItems: guestCart,
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
      localStorage.setItem("mobile", user.mobile_number);
    }

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
        mobile_number:
          typeof window !== "undefined" ? localStorage.getItem("mobile") : null,
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
