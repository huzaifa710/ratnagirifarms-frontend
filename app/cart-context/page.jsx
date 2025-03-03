"use client";
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { environment } from "@/environment";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const uuid = "d0e66e4c-0195-4375-a327-676a38f62e88";

  const updateCartCount = async () => {
    try {
      const response = await axios.get(
        `${environment.API_URL}/carts/count/${uuid}`
      );
      const count = response.data.count;
      setCartCount(count);
    } catch (error) {
      console.error("Error updating cart count:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
