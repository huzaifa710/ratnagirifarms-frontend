"use client";
import { useState, useEffect } from "react";
import { environment } from "@/environment";
import axios from "axios";
import styles from "./page.module.css";
import { FaTrash } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import { useCart } from "@/app/cart-context/page";

const uuid = "d0e66e4c-0195-4375-a327-676a38f62e88";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateCartCount } = useCart();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `${environment.API_URL}/carts/by-uuid/${uuid}`
      );
      setCartItems(response.data.cartItems);
      setLoading(false);
      updateCartCount()
    } catch (error) {
      toast.error("Failed to fetch cart items");
      setLoading(false);
    }
  };

  const removeFromCart = async (product_variant_id, quantity) => {
    try {
      const payload = { uuid, product_variant_id, quantity };
      await axios.post(`${environment.API_URL}/carts/remove`, payload);
      toast.success("Item removed from cart");
      fetchCartItems();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = async (product_variant_id) => {
    try {
      await axios.post(`${environment.API_URL}/carts/add`, {
        uuid: "d0e66e4c-0195-4375-a327-676a38f62e88",
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

  return (
    <div className={styles.cartContainer}>
      <Toaster position="top-center" />
      <h1 className={styles.title}>Shopping Cart</h1>
      {loading ? (
        <p>Loading...</p>
      ) : cartItems.length === 0 ? (
        <p className={styles.emptyCart}>Your cart is empty</p>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
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
                {cartItems.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                )}
              </span>
            </div>
            <button className={styles.checkoutButton}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}
