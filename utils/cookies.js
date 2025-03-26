import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";

export const CART_COOKIE_ID = "guest_uuid";
export const CART_COOKIE_DATA = "cart_data";

export const setGuestUUID = () => {
  try {
    const guestUUID = Cookies.get(CART_COOKIE_ID);
    if (!guestUUID) {
      Cookies.set(CART_COOKIE_ID, uuidv4(), { expires: 30 });
    }
    return Cookies.get(CART_COOKIE_ID);
  } catch (error) {
    console.error("Error setting guest UUID cookie:", error);
    return null;
  }
};

export const getCartUUID = () => {
  try {
    const uuid = Cookies.get(CART_COOKIE_ID);
    return uuid;
  } catch (error) {
    console.error("Error parsing cart cookie:", error);
    return [];
  }
};

export const getCartFromCookie = () => {
  try {
    // Make sure we have a guest UUID
    setGuestUUID();

    // Get cart data from the cart_data cookie
    const cart = Cookies.get(CART_COOKIE_DATA);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error parsing cart cookie:", error);
    return [];
  }
};

export const setCartCookie = (cart) => {
  try {
    if (cart.length === 0) {
      Cookies.remove(CART_COOKIE_DATA);
    } else {
      setGuestUUID();
      // Store cart data in the cart_data cookie
      Cookies.set(CART_COOKIE_DATA, JSON.stringify(cart), {
        expires: 7,
      });
    }
  } catch (error) {
    console.error("Error setting cart cookie:", error);
  }
};
