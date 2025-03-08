"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { uuid, accessToken } = useAuth();

  const updateCartCount = async () => {
    if (!uuid && !accessToken) {
      setCartCount(0);
      return;
    }

    try {
      const response = await api.get(`/carts/count/${uuid}`);
      const count = response.data.count;
      setCartCount(count);
    } catch (error) {
      console.error("Error updating cart count:", error);
      setCartCount(0);
    }
  };

  useEffect(() => {
    if (uuid && accessToken) {
      updateCartCount();
    }
  }, [uuid, accessToken]);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
