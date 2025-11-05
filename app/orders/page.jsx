"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/cart-context/page";
import AuthModal from "@/app/otp/page";
import { FaExclamationTriangle } from "react-icons/fa";

export default function Orders() {
  const { uuid, accessToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { updateCartCount } = useCart();

  // State to track which orders are expanded
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    if (!uuid && !accessToken) {
      setShowAuthModal(true);
      return;
    }
    updateCartCount();
    fetchOrders();
  }, [uuid, accessToken]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/${uuid}`);
      setOrders(response.data.orders || []);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpansion = (orderId) => {
    setExpandedOrders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const handleReorder = async (order) => {
    try {
      // Simple reorder: add each item again
      await Promise.all(
        order.order_items.map((it) =>
          api.post("/carts/add", {
            uuid,
            product_variant_id: it.product_variant_id,
            quantity: it.quantity,
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

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowConfirmation(true);
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      const response = await api.post("/orders/cancel", {
        order_id: selectedOrderId,
        uuid,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error(error);
    } finally {
      setIsCancelling(false);
      setShowConfirmation(false);
      setSelectedOrderId(null);
    }
  };

  const getStatusMeta = (status) => {
    switch (status) {
      case "delivered":
        return {
          cls: styles.badgeDelivered,
          icon: "check_circle",
          label: "Delivered",
        };
      case "shipped":
        return {
          cls: styles.badgeShipped,
          icon: "local_shipping",
          label: "Shipped",
        };
      case "processing":
        return {
          cls: styles.badgeProcessing,
          icon: "hourglass_top",
          label: "Processing",
        };
      case "approved":
        return {
          cls: styles.badgeApproved,
          icon: "verified",
          label: "Approved",
        };
      case "cancelled":
        return {
          cls: styles.badgeCancelled,
          icon: "cancel",
          label: "Cancelled",
        };
      default:
        return {
          cls: styles.badgeProcessing,
          icon: "hourglass_top",
          label: status,
        };
    }
  };

  function getPaymentStatusMeta(status) {
    switch (status?.toLowerCase()) {
      case "paid":
        return { cls: styles.paymentPaid, label: "Paid" };
      case "pending":
        return { cls: styles.paymentUnpaid, label: "Pending" };
      case "refunded":
        return { cls: styles.paymentRefunded, label: "Refunded" };
      default:
        return { cls: styles.paymentUnpaid, label: status };
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!orders.length)
    return (
      <div className={styles.ordersContainer}>
        <Toaster position="top-center" />
        <h1 className={styles.titleNew}>My Orders</h1>
        <div className={styles.titleBar}></div>
        <p className={styles.emptyOrders}>No orders found</p>
      </div>
    );

  return (
    <div className={styles.ordersContainer}>
      <Toaster position="top-center" />
      <h1 className={styles.titleNew}>My Orders</h1>
      <div className={styles.titleBar}></div>

      <div className={styles.cardsStack}>
        {orders.map((order) => {
          const meta = getStatusMeta(order.order_status);
          const paymentMeta = getPaymentStatusMeta(order.payment_status);
          const isExpanded = expandedOrders.has(order.id);
          return (
            <div key={order.id} className={styles.orderCardNew}>
              <div
                className={styles.cardTop}
                onClick={() => toggleOrderExpansion(order.id)}
                style={{ cursor: "pointer" }}
              >
                <div>
                  <p className={styles.orderIdLine}>
                    Order ID:{" "}
                    <span className={styles.orderIdValue}>
                      {order.order_id}
                    </span>
                  </p>
                  <p className={styles.orderDateLine}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className={styles.amountBlock}>
                  <p className={styles.amountValue}>₹{order.total_amount}</p>
                </div>
              </div>

              <div
                className={styles.statusRow}
                onClick={() => toggleOrderExpansion(order.id)}
                style={{ cursor: "pointer" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    gap: "1rem",
                  }}
                >
                  <div className={styles.statusGroup}>
                    <span className={styles.statusLabel}>Order Status:</span>
                    <span className={`${styles.statusBadgeBase} ${meta.cls}`}>
                      <span className={styles.materialIcon}>{meta.icon}</span>
                      {meta.label}
                    </span>
                  </div>
                  
                  <div className={styles.statusGroup}>
                    <span className={styles.statusLabel}>Payment:</span>
                    <span className={`${styles.statusBadgeBase} ${paymentMeta.cls}`}>
                      {paymentMeta.label}
                    </span>
                  </div>
                  
                  <span
                    className={styles.materialIcon}
                    style={{ color: "#6b7280" }}
                  >
                    {isExpanded ? "expand_less" : "expand_more"}
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className={styles.itemsSection}>
                  {order.order_items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <img
                        src={item.product_variant.product.image_url}
                        alt={item.product_variant.product.name}
                        className={styles.itemImage}
                      />
                      <div className={styles.itemInfo}>
                        <h3 className={styles.itemName}>
                          {item.product_variant.product.name}
                        </h3>
                        <p className={styles.itemQty}>
                          Quantity: {item.quantity}
                        </p>
                        <p className={styles.itemPrice}>
                          ₹{item.price_per_unit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.actionsRow}>
                <div className={styles.leftActions}>
                  <button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className={`${styles.actionBtn} ${styles.viewBtn}`}
                  >
                    <span className={styles.materialIconSmall}>visibility</span>
                    View Details
                  </button>
                </div>
                <div className={styles.rightActions}>
                  {order.order_status === "delivered" && (
                    <button
                      onClick={() => handleReorder(order)}
                      className={`${styles.actionBtn} ${styles.reorderBtn}`}
                    >
                      <span className={styles.materialIconSmall}>refresh</span>
                      Reorder
                    </button>
                  )}
                  {order.order_status === "processing" && (
                    <>
                      {isExpanded && (
                        <button
                          onClick={() => handleCancelClick(order.id)}
                          className={`${styles.actionBtn} ${styles.cancelBtn}`}
                        >
                          Cancel order
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Global Confirmation Modal */}
      {showConfirmation && (
        <div className={styles.confirmationOverlay}>
          <div className={styles.confirmationModal}>
            <div className={styles.modalHeader}>
              <FaExclamationTriangle className={styles.warningIcon} />
              <h3 className={styles.confirmationTitle}>Cancel Order?</h3>
            </div>
            <p className={styles.confirmationMessage}>
              Are you sure you want to cancel this order? This action cannot be
              undone and any payment will be refunded within 5-7 business days.
            </p>
            <div className={styles.confirmationButtons}>
              <button
                className={styles.cancelModalButton}
                onClick={() => {
                  setShowConfirmation(false);
                  setSelectedOrderId(null);
                }}
                disabled={isCancelling}
              >
                No, Keep Order
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmCancel}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Yes, Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
