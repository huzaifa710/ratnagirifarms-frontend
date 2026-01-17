"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { FaSearch, FaFilter, FaEdit } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import api from "@/utils/axios";
import { useRouter } from "next/navigation";

export default function AdminOrders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 0,
  });
  const [filters, setFilters] = useState({
    order_status: "",
    payment_status: "",
    name: "",
    start_date: "",
    end_date: "",
    order_id: "",
  });
  const [appliedFilters, setAppliedFilters] = useState({
    order_status: "",
    payment_status: "",
    name: "",
    start_date: "",
    end_date: "",
    order_id: "",
  });
  const [editingOrder, setEditingOrder] = useState(null);
  const [awbNumber, setAwbNumber] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await api.post("/orders/all", {
        page: pagination.current_page,
        limit: pagination.per_page,
        ...appliedFilters,
      });
      setOrders(response.data.orders);
      setPagination({
        ...pagination,
        total_pages: response.data.pagination.total_pages,
      });
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.current_page, pagination.per_page, appliedFilters]); // Added pagination.per_page

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
    setPagination({ ...pagination, current_page: 1 });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      order_status: "",
      payment_status: "",
      name: "",
      start_date: "",
      end_date: "",
      order_id: "",
    };
    setFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    setPagination({ ...pagination, current_page: 1 });
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    if (updating) return;
    // For shipped status, ensure we have a valid AWB number
    if (newStatus === "shipped" && !awbNumber.trim()) {
      toast.error("Please enter AWB number");
      return;
    }
    setUpdating(true);
    try {
      const payload = {
        order_id: orderId,
        status: newStatus,
      };
      if (newStatus === "shipped") {
        payload.awb = awbNumber.trim();
      }
      const response = await api.post("/orders/update-status", payload);
      if (response.data.success) {
        await fetchOrders();
        toast.success(`Order ${newStatus} successfully`);
        setEditingOrder(null);
        setAwbNumber("");
      } else {
        toast.error(response.data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  const OrderStatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case "processing":
          return "#ffd700";
        case "approved":
          return "#32cd32";
        case "packed":
          return "#32cd32";
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
    return (
      <span
        className={styles.statusBadge}
        style={{ backgroundColor: getStatusColor(status) }}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />
      <div className={styles.header}>
        <h1>Orders Management</h1>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <select
            name="order_status"
            value={filters.order_status}
            onChange={handleFilterChange}
          >
            <option value="">All Order Status</option>
            <option value="processing">Processing</option>
            <option value="approved">Approved</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            name="payment_status"
            value={filters.payment_status}
            onChange={handleFilterChange}
          >
            <option value="">All Payment Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>

          <input
            type="text"
            name="name"
            placeholder="Search by name"
            value={filters.name}
            onChange={handleFilterChange}
          />

          <input
            type="text"
            name="order_id"
            placeholder="Search by Order ID"
            value={filters.order_id}
            onChange={handleFilterChange}
          />

          <input
            type="date"
            name="start_date"
            value={filters.start_date}
            onChange={handleFilterChange}
          />

          <input
            type="date"
            name="end_date"
            value={filters.end_date}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.filterButtons}>
          <button className={styles.applyButton} onClick={handleApplyFilters}>
            Apply Filters
          </button>
          <button className={styles.clearButton} onClick={handleClearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      {/* Orders per page selector */}
      <div className={styles.ordersPerPage}>
        <label htmlFor="per_page">Orders per page: </label>
        <select
          id="per_page"
          value={pagination.per_page}
          onChange={(e) => {
            setPagination({
              ...pagination,
              per_page: parseInt(e.target.value),
              current_page: 1,
            });
          }}
        >
          <option value={10}>10</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={500}>500</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Order Status</th>
              <th>Payment Status</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className={styles.loading}>
                  Loading...
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.order_id}</td>
                  <td>{order.user_address.full_name}</td>
                  <td>
                    {editingOrder === order.id ? (
                      <div className={styles.statusEdit}>
                        {/* If the order is in "packed" state, show AWB input and Ship Order button */}
                        {order.order_status === "packed" ? (
                          <div className={styles.awbInputContainer}>
                            <input
                              type="text"
                              className={styles.awbInput}
                              placeholder="Enter AWB Number"
                              value={awbNumber}
                              onChange={(e) => setAwbNumber(e.target.value)}
                            />
                            <button
                              className={styles.saveButton}
                              onClick={() => {
                                if (!awbNumber.trim()) {
                                  toast.error("Please enter AWB number");
                                  return;
                                }
                                handleStatusUpdate(order.id, "shipped");
                              }}
                              disabled={updating}
                            >
                              Ship Order
                            </button>
                            <button
                              className={styles.cancelButton}
                              onClick={() => {
                                setEditingOrder(null);
                                setAwbNumber("");
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          // For other statuses, use a select dropdown
                          <div className={styles.selectContainer}>
                            <select
                              className={styles.statusSelect}
                              value={order.order_status}
                              onChange={(e) => {
                                const newStatus = e.target.value;
                                handleStatusUpdate(order.id, newStatus);
                              }}
                            >
                              <option value={order.order_status} disabled>
                                {order.order_status.toUpperCase()}
                              </option>
                              {order.order_status === "approved" && (
                                <option value="packed">PACKED</option>
                              )}
                              {order.order_status === "processing" && (
                                <option value="approved">APPROVE</option>
                              )}
                              {order.order_status === "shipped" && (
                                <option value="delivered">DELIVER</option>
                              )}
                            </select>
                            <button
                              className={styles.cancelButton}
                              onClick={() => setEditingOrder(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={styles.statusContainer}>
                        <OrderStatusBadge status={order.order_status} />
                        {order.order_status !== "delivered" &&
                          order.order_status !== "cancelled" && (
                            <button
                              className={styles.editButton}
                              onClick={() => setEditingOrder(order.id)}
                            >
                              <FaEdit />
                            </button>
                          )}
                      </div>
                    )}
                  </td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${
                        styles[order.payment_status]
                      }`}
                    >
                      {order.payment_status.toUpperCase()}
                    </span>
                  </td>
                  <td>₹{order.total_amount}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      className={styles.viewButton}
                      onClick={() =>
                        window.open(`/admin/noob/orders/${order.id}`, "_blank")
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button
          disabled={pagination.current_page === 1}
          onClick={() =>
            setPagination({
              ...pagination,
              current_page: pagination.current_page - 1,
            })
          }
        >
          Previous
        </button>
        <span>
          Page {pagination.current_page} of {pagination.total_pages}
        </span>
        <button
          disabled={pagination.current_page === pagination.total_pages}
          onClick={() =>
            setPagination({
              ...pagination,
              current_page: pagination.current_page + 1,
            })
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
