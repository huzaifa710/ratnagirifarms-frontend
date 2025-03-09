import Cookies from 'js-cookie';

export const CART_COOKIE_NAME = 'guest_cart';

export const getCartFromCookie = () => {
  try {
    const cart = Cookies.get(CART_COOKIE_NAME);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error parsing cart cookie:', error);
    return [];
  }
};

export const setCartCookie = (cart) => {
  Cookies.set(CART_COOKIE_NAME, JSON.stringify(cart), { expires: 7 }); // Expires in 7 days
};