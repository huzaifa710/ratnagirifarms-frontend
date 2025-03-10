"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { FaTrash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { useCart } from "@/app/cart-context/page";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateCartCount, guestCart, addToGuestCart, removeFromGuestCart } =
    useCart();
  const { uuid, accessToken } = useAuth();
  const router = useRouter();

  const fetchCartItems = async () => {
    if (!uuid && !accessToken) {
      setCartItems(guestCart);
      setLoading(false);
      return;
    }
    try {
      const response = await api.get(`/carts/by-uuid/${uuid}`);
      setCartItems(response.data.cartItems);
      setLoading(false);
      updateCartCount();
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch cart items");
      setLoading(false);
    }
  };

  const handleAddToCart = async (product_variant_id) => {
    if (!uuid || !accessToken) {
      const product = cartItems.find(
        (item) => item.product_variant_id === product_variant_id
      );
      if (product) {
        addToGuestCart(product);
        toast.success("Added to cart");
      }
      return;
    }
    try {
      await api.post(`/carts/add`, {
        uuid: uuid,
        product_variant_id,
        quantity: 1,
      });
      toast.success("Added to cart");
      fetchCartItems();
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    }
  };

  const removeFromCart = async (product_variant_id, quantity) => {
    if (!uuid || !accessToken) {
      removeFromGuestCart(product_variant_id, quantity);
      toast.success("Item removed from cart");
      fetchCartItems();
      return;
    }
    try {
      const payload = { uuid: uuid, product_variant_id, quantity };
      await api.post(`/carts/remove`, payload);
      toast.success("Item removed from cart");
      fetchCartItems();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [uuid, accessToken, guestCart]);

  return (
    <div className={styles.cartContainer}>
      <Toaster position="top-center" />
      <h1 className={styles.title}>Shopping Cart</h1>
      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length == 0 ? (
        <p className={styles.emptyCart}>Your cart is empty</p>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cartItems?.map((item) => (
              <div key={item.product_variant_id} className={styles.cartItem}>
                <img
                  src="/card/image1.png"
                  alt={item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>
                  <p>₹{item.price} per box</p>
                  <p>{item.quantity_per_box} pieces per box</p>
                </div>
                <div className={styles.quantityControl}>
                  <button
                    onClick={() => removeFromCart(item.product_variant_id, 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleAddToCart(item.product_variant_id)}
                  >
                    +
                  </button>
                </div>
                <div className={styles.itemTotal}>
                  <p>₹{item.price * item.quantity}</p>
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() =>
                    removeFromCart(item.product_variant_id, item.quantity)
                  }
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
          <div className={styles.cartSummary}>
            <h2>Cart Total</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>
                ₹
                {cartItems?.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                )}
              </span>
            </div>
            <button
              className={styles.checkoutButton}
              onClick={() => router.push("/checkout")}
            >
              Proceed to Checkout
            </button>
            {!uuid && !accessToken && (
              <button
                className={styles.checkoutButton}
                onClick={() => router.push("/checkout?guest=true")}
              >
                Proceed as Guest
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
