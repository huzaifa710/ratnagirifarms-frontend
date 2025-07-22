"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";
import {
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
} from "react-icons/fa";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/cart-context/page";
import AuthModal from "@/app/otp/page";

export default function Orders() {
  const { uuid, accessToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const router = useRouter();
  const { updateCartCount } = useCart();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!uuid && !accessToken) {
      setShowAuthModal(true);
      return;
    }
    updateCartCount();
    fetchOrders();
  }, [uuid, accessToken]);

  useEffect(() => {
    // Set the first order as expanded by default
    if (orders.length > 0 && !expandedOrderId) {
      setExpandedOrderId(orders[0].id);
    }
  }, [orders]);

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/${uuid}`);
      setOrders(response.data.orders);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch orders");
      setLoading(false);
    }
  };

  const handleOrderClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "#ffd700";
      case "shipped":
        return "#1e90ff";
      case "delivered":
        return "#32cd32";
      case "cancelled":
        return "#ff4d4d";
      default:
        return "#888";
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
  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <>
      <script>
        gtag('event', 'ads_conversion_Purchase_1',{" "}
        {
          // <event_parameters>
        }
        );
      </script>
      <div className={styles.ordersContainer}>
        <Toaster position="top-center" />
        <h1 className={styles.title}>My Orders</h1>

        <div className={styles.ordersList}>
          {orders.length === 0 ? (
            <p className={styles.emptyOrders}>No orders found</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div
                  className={styles.orderSummary}
                  onClick={() => handleOrderClick(order.id)}
                >
                  <div className="flex justify-between mb-3">
                    <div className={styles.orderIdDate}>
                      <h2>Order ID: {order.order_id}</h2>
                      <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className={styles.orderAmount}>
                      Total Amount: ₹{order.total_amount}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span>Payment Status:</span>
                      <span
                        className={styles.statusBadge}
                        style={{
                          backgroundColor:
                            order.payment_status === "paid"
                              ? "#32cd32"
                              : "#ff4d4d",
                        }}
                      >
                        {order.payment_status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span>Order Status:</span>
                        <span
                          className={styles.statusBadge}
                          style={{
                            backgroundColor: getStatusColor(order.order_status),
                          }}
                        >
                          {order.order_status.toUpperCase()}
                        </span>
                      </div>
                      <span className="">
                        {expandedOrderId === order.id ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {expandedOrderId === order.id && (
                  <div className={styles.orderDetails}>
                    <div className={styles.orderItems}>
                      <h3>Order Items</h3>
                      {order.order_items.map((item) => (
                        <div key={item.id} className={styles.item}>
                          <div className={styles.itemInfo}>
                            <h3 className="text-[#014421] font-semibold">
                              {item.product_variant.product.name}
                            </h3>
                            <p className="text-[#014421]/70">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-[#014421]/70">
                              Price per unit: ₹{item.price_per_unit}
                            </p>
                            <p className="text-[#014421]/70">
                              No Of Pieces Per Box :{" "}
                              {item.product_variant.quantity_per_box}
                            </p>
                          </div>
                          <div className={styles.itemTotal}>
                            ₹{item.total_price}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className={styles.orderFooter}>
                      <div className={styles.deliveryAddress}>
                        <div>
                          <h3 className="text-[#014421] font-semibold">
                            Delivery Address
                          </h3>
                          <p className="text-[#014421]/70">
                            {order.user_address.address}
                          </p>
                          <p className="text-[#014421]/70">
                            {order.user_address.city},{" "}
                            {order.user_address.state}
                          </p>
                          <p className="text-[#014421]/70">
                            {order.user_address.pincode}
                          </p>
                        </div>
                        {order.order_status === "processing" && (
                          <button
                            onClick={() => handleCancelClick(order.id)}
                            className={styles.cancelButton}
                          >
                            <FaExclamationTriangle />
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className={styles.confirmationOverlay}>
            <div className={styles.confirmationModal}>
              <h3 className={styles.confirmationTitle}>Cancel Order?</h3>
              <p className={styles.confirmationMessage}>
                Are you sure you want to cancel this order? This action cannot
                be undone.
              </p>
              <div className={styles.confirmationButtons}>
                <button
                  className={styles.cancelModalButton}
                  onClick={() => setShowConfirmation(false)}
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
    </>
  );
}
