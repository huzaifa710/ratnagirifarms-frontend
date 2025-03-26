"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/app/auth-context/page";
import axios from "axios";
import { getCartFromCookie, setCartCookie, getCartUUID } from "@/utils/cookies";
import api from "@/utils/axios";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const [guestCart, setGuestCart] = useState([]);
  const { uuid, accessToken } = useAuth();

  useEffect(() => {
    if (!uuid || !accessToken) {
      const cookieCart = getCartFromCookie();
      setGuestCart(cookieCart);
      setCartCount(cookieCart ? cookieCart.length : 0);
    }
  }, [uuid, accessToken]);

  const updateCartCount = async () => {
    if (!uuid || !accessToken) {
      const cookieCart = getCartFromCookie();
      setCartCount(cookieCart ? cookieCart.length : 0);
      return;
    }

    try {
      const response = await api.get(`/carts/count/${uuid}`);
      setCartCount(response.data.count);
    } catch (error) {
      console.error("Error updating cart count:", error);
      setCartCount(0);
    }
  };

  const addToGuestCart = async (product) => {
    const updatedCart = [...guestCart];
    const existingItem = updatedCart.find(
      (item) => item.product_variant_id === product.product_variant_id
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // Only store product_variant_id and quantity
      updatedCart.push({
        product_variant_id: product.product_variant_id,
        quantity: 1,
      });
    }

    setGuestCart(updatedCart);
    setCartCookie(updatedCart);
    updateCartCount();

    const uuid = getCartUUID();
    if (uuid) {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/carts/guest/add`, {
        uuid,
        product_variant_id: product.product_variant_id,
        quantity: 1,
      });
    }
  };

  const removeFromGuestCart = (product_variant_id, quantity = 1) => {
    const updatedCart = guestCart
      .map((item) => {
        if (item.product_variant_id === product_variant_id) {
          return {
            product_variant_id: item.product_variant_id,
            quantity: Math.max(0, item.quantity - quantity),
          };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    setGuestCart(updatedCart);
    setCartCookie(updatedCart);
    updateCartCount();
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        updateCartCount,
        guestCart,
        addToGuestCart,
        removeFromGuestCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
