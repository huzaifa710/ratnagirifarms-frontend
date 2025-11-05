"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";
import styles from "./page.module.css";
import { useCart } from "@/app/cart-context/page";

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const { uuid, accessToken } = useAuth();
  const { updateCartCount } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uuid && !accessToken) {
      router.push("/orders");
      return;
    }
    fetchOrderDetails();
  }, [params.id, uuid, accessToken]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/${uuid}`);
      const orders = response.data.orders || [];
      const foundOrder = orders.find((o) => o.id.toString() === params.id);

      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        toast.error("Order not found");
        router.push("/orders");
      }
    } catch (error) {
      toast.error("Failed to fetch order details");
      router.push("/orders");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async () => {
    try {
      await Promise.all(
        order.order_items.map((item) =>
          api.post("/carts/add", {
            uuid,
            product_variant_id: item.product_variant_id,
            quantity: item.quantity,
          })
        )
      );
      updateCartCount();
      toast.success("Items added to cart");
      router.push("/cart");
    } catch {
      toast.error("Failed to reorder");
    }
  };

  const handleTrackOrder = () => {
    if (order.awb_number) {
      window.open(
        `https://www.aftership.com/track/${order.awb_number}`,
        "_blank"
      );
    } else {
      toast.error("Tracking not available yet");
    }
  };

  const formatAddress = (address) => {
    if (!address) return "N/A";
    return `${address.address}, ${address.city}, ${address.state} ${address.postal_code}`;
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Order not found</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />

      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          <span className={styles.backIcon}>←</span>
        </button>
        <h2 className={styles.headerTitle}>Order Details</h2>
      </div>

      {/* Order Number */}
      <h3 className={styles.orderNumber}>Order #{order.order_id}</h3>

      {/* Products List */}
      <div className={styles.productsSection}>
        {order.order_items.map((item) => (
          <div key={item.id} className={styles.productItem}>
            <div className={styles.productInfo}>
              <img
                src={item.product_variant.product.image_url}
                alt={item.product_variant.product.name}
                className={styles.productImage}
              />
              <div className={styles.productDetails}>
                <p className={styles.productName}>
                  {item.product_variant.product.name}
                </p>
                <p className={styles.productCategory}>
                  Quantity: {item.quantity}
                </p>
              </div>
            </div>
            <div className={styles.productPrice}>
              <p>₹{item.price_per_unit * item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping Address */}
      <h3 className={styles.sectionTitle}>Shipping Address</h3>
      <p className={styles.sectionContent}>
        {order.user_address ? formatAddress(order.user_address) : "N/A"}
      </p>

      {/* Billing Address */}
      <h3 className={styles.sectionTitle}>Billing Address</h3>
      <p className={styles.sectionContent}>Same as shipping address</p>

      {/* Shipping Method */}
      <h3 className={styles.sectionTitle}>Shipping Method</h3>
      <p className={styles.sectionContent}>Standard Shipping</p>

      {/* Payment Information */}
      <h3 className={styles.sectionTitle}>Payment Information</h3>
      <p className={styles.sectionContent}>
        {order.payment_method || "Credit Card"}
      </p>

      {/* Order Summary */}
      <h3 className={styles.sectionTitle}>Order Summary</h3>
      <div className={styles.orderSummary}>
        <div className={styles.summaryRow}>
          <p className={styles.summaryLabel}>Subtotal</p>
          <p className={styles.summaryValue}>₹{order.subtotal.toFixed(2)}</p>
        </div>
        <div className={styles.summaryRow}>
          <p className={styles.summaryLabel}>Shipping</p>
          <p className={styles.summaryValue}>Free</p>
        </div>
        <div className={styles.summaryRow}>
          <p className={styles.summaryLabel}>Handling Charges</p>
          <p className={styles.summaryValue}>
            ₹{order.handling_charges.toFixed(2)}
          </p>
        </div>
        <div className={styles.summaryRow}>
          <p className={styles.summaryLabel}>Discount</p>
          <p className={styles.summaryValue}>
            -₹{order.discount_amount.toFixed(2)}
          </p>
        </div>
        <div className={styles.summaryRow}>
          <p className={styles.summaryLabel}>Total</p>
          <p className={styles.summaryValue}>
            ₹{order.total_amount.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className={styles.actionButtons}>
        <button onClick={handleReorder} className={styles.secondaryButton}>
          Reorder All Items
        </button>
        {/* <button className={styles.secondaryButton}>Contact Support</button> */}
      </div>
    </div>
  );
}
