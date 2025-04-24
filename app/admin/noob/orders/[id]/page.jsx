"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "./page.module.css";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";
import { FaArrowLeft, FaCheck, FaShip, FaTruck } from "react-icons/fa";

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [awbNumber, setAwbNumber] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await api.get(`/orders/by-id/${id}`);
      setOrder(response.data.order);
    } catch (error) {
      toast.error("Failed to fetch order details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (updating) return;

    if (newStatus === "shipped" && !awbNumber) {
      toast.error("Please enter AWB number");
      return;
    }

    setUpdating(true);
    try {
      await api.post("/orders/update-status", {
        order_id: id,
        status: newStatus,
        awb: awbNumber,
      });

      await fetchOrderDetails();
      toast.success(`Order ${newStatus} successfully`);
    } catch (error) {
      toast.error("Failed to update order status");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (!order) return <div className={styles.error}>Order not found</div>;

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />

      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          <FaArrowLeft /> Back to Orders
        </button>
        <div>
          <h1>Order #{order.order_id}</h1>
          <p className={styles.orderDate}>
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Status and Actions Section */}
        <div className={styles.section}>
          <h2>Order Status</h2>
          <div className={styles.statusContainer}>
            <div className={styles.statusBadges}>
              <span
                className={`${styles.statusBadge} ${
                  styles[order.order_status]
                }`}
              >
                {order.order_status.toUpperCase()}
              </span>
              <span
                className={`${styles.statusBadge} ${
                  styles[order.payment_status]
                }`}
              >
                {order.payment_status.toUpperCase()}
              </span>
            </div>

            {order.awb_number && (
              <div className={styles.awbInfo}>
                <span>AWB Number:</span>
                <strong>{order.awb_number}</strong>
              </div>
            )}

            <div className={styles.actions}>
              {order.order_status === "processing" && (
                <button
                  className={styles.actionButton}
                  onClick={() => handleStatusUpdate("approved")}
                  disabled={updating}
                >
                  <FaCheck /> Approve Order
                </button>
              )}

              {order.order_status === "approved" && (
                <div className={styles.shippingAction}>
                  <input
                    type="text"
                    placeholder="Enter AWB Number"
                    value={awbNumber}
                    onChange={(e) => setAwbNumber(e.target.value)}
                    className={styles.awbInput}
                  />
                  <button
                    className={styles.actionButton}
                    onClick={() => handleStatusUpdate("shipped")}
                    disabled={updating || !awbNumber}
                  >
                    <FaShip /> Mark as Shipped
                  </button>
                </div>
              )}

              {order.order_status === "shipped" && (
                <button
                  className={styles.actionButton}
                  onClick={() => handleStatusUpdate("delivered")}
                  disabled={updating}
                >
                  <FaTruck /> Mark as Delivered
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className={styles.section}>
          <h2>Customer Details</h2>
          <div className={styles.customerInfo}>
            <h3>{order.user_address.full_name}</h3>
            <p>{order.user_address.email}</p>
            <p>{order.user_address.mobile_number}</p>
            <div className={styles.address}>
              <h4>Shipping Address</h4>
              <p>{order.user_address.address}</p>
              <p>
                {order.user_address.city}, {order.user_address.state} -{" "}
                {order.user_address.pincode}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className={`${styles.section} ${styles.fullWidth}`}>
          <h2>Order Items</h2>
          <div className={styles.itemsTable}>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.order_items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.productInfo}>
                        <strong>{item.product_variant.product.name}</strong>
                        <span>{item.product_variant.sku_code}</span>
                        <span>{item.product_variant.quantity_per_box}</span>
                      </div>
                    </td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price_per_unit}</td>
                    <td>₹{item.total_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Summary */}
        <div className={styles.section}>
          <h2>Order Summary</h2>
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount_amount > 0 && (
              <div className={styles.summaryRow}>
                <span>Discount</span>
                <span>-₹{order.discount_amount}</span>
              </div>
            )}
            {order.coupon_id && (
              <div className={styles.summaryRow}>
                <span>Coupon Applied</span>
                <span>
                  {order.coupon.discount_type === "percentage"
                    ? `${order.coupon.discount_value}% Off`
                    : `Flat ₹${order.coupon.discount_value} Off`}
                </span>
              </div>
            )}
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total Amount</span>
              <span>₹{order.total_amount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
