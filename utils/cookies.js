import Cookies from "js-cookie";

export const CART_COOKIE_NAME = "guest_cart";

export const getCartFromCookie = () => {
  try {
    const cart = Cookies.get(CART_COOKIE_NAME);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error("Error parsing cart cookie:", error);
    return [];
  }
};

export const setCartCookie = (cart) => {
  try {
    if (cart.length === 0) {
      Cookies.remove(CART_COOKIE_NAME); // Explicitly remove cookie if empty
    } else {
      Cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), { expires: 7 });
    }
  } catch (error) {
    console.error("Error setting cart cookie:", error);
  }
};
