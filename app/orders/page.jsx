"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Orders() {
  const { uuid, accessToken } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const router = useRouter();
  
  useEffect(() => {
    if (!uuid || !accessToken) {
      router.push("/login");
      return;
    }
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

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
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
                <div className={styles.orderBasicInfo}>
                  <div className={styles.orderIdDate}>
                    <h2>Order #{order.id}</h2>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={styles.orderAmount}>
                    Total Amount: ₹{order.total_price}
                  </div>
                </div>
                <div className={styles.statusContainer}>
                  <div className={styles.statusGroup}>
                    <span className={styles.statusLabel}>Payment:</span>
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
                  <div className={styles.statusGroup}>
                    <span className={styles.statusLabel}>Order Status:</span>
                    <span
                      className={styles.statusBadge}
                      style={{
                        backgroundColor: getStatusColor(order.order_status),
                      }}
                    >
                      {order.order_status.toUpperCase()}
                    </span>
                  </div>
                  <span className={styles.expandIcon}>
                    {expandedOrderId === order.id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </span>
                </div>
              </div>

              {expandedOrderId === order.id && (
                <div className={styles.orderDetails}>
                  <div className={styles.orderItems}>
                    <h3>Order Items</h3>
                    {order.order_items.map((item) => (
                      <div key={item.id} className={styles.item}>
                        <div className={styles.itemInfo}>
                          <h3>{item.product_variant.product.name}</h3>
                          <p>Quantity: {item.quantity}</p>
                          <p>Price per unit: ₹{item.price_per_unit}</p>
                          <p>No Of Pieces Per Box : ₹{item.price_per_unit}</p>
                        </div>
                        <div className={styles.itemTotal}>
                          ₹{item.total_price}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.deliveryAddress}>
                      <h3>Delivery Address</h3>
                      <p>{order.user_address.address}</p>
                      <p>
                        {order.user_address.city}, {order.user_address.state}
                      </p>
                      <p>{order.user_address.pincode}</p>
                    </div>
                    {/* <div className={styles.orderTotal}>
                      <span>Total Amount</span>
                      <span>₹{order.total_price}</span>
                    </div> */}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
