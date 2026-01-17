"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import api from "../../../../utils/axios";
import { toast } from "react-hot-toast";

const getOrderStatusClass = (status) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
        case 'processing': return styles.statusProcessing;
        case 'shipped': return styles.statusShipped;
        case 'delivered': return styles.statusDelivered;
        case 'cancelled': return styles.statusCancelled;
        default: return '';
    }
}

const getPaymentStatusClass = (status) => {
    if (!status) return '';
    switch (status.toLowerCase()) {
        case 'paid': return styles.paymentPaid;
        case 'pending': return styles.paymentPending;
        case 'failed': return styles.paymentFailed;
        case 'unpaid': return styles.paymentFailed;
        case 'refunded': return styles.paymentRefunded;
        default: return '';
    }
}

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await api.post("/orders/all");
        if (response.data.success) {
          setOrders(response.data.orders);
          setPagination(response.data.pagination)
        } else {
          toast.error(response.data.message || "Failed to fetch orders.");
        }
      } catch (err) {
        setError(err);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className={styles.container}>
        <aside className={styles.sidebar}>
        <div>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo} style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDy-Pzw1JLh7RqVHN67PF1hIVaZB9skVylRjKlqrSTy1UqDnIARuKZcibvdRCbS7-hqEFBfswz4_NBY1gHQFAT8z6uK6m4BY10auF7c-DPBFwNeUk_pTu09KgMn1ldqswDblHnJqLk8c2Uo_2TRRLrRm2Gw8OfoXFGtW0y5KoIMQ-ySwW01GQyIqJiR1IxKCKTjLz4dw3bsEXTEVxXTpIQsJ05D6awqt6x8ox4m62Negf2SQvMQVBoz7ilErJcPx_6heHPUeNRtI10')`}}></div>
            <div className={styles.titleWrapper}>
              <h1>Ratnagiri Farms</h1>
              <p>Admin Dashboard</p>
            </div>
          </div>
          <nav className={styles.navMenu}>
                <Link href="/admin/noob/home" className={styles.navLink}>
                    <span className="material-symbols-outlined">home</span>
                    <span>Home</span>
                </Link>
                <Link href="/admin/noob/orders" className={`${styles.navLink} ${styles.active}`}>
                    <span className="material-symbols-outlined">shopping_bag</span>
                    <span>Orders</span>
                </Link>
                <Link href="#" className={styles.navLink}>
                    <span className="material-symbols-outlined">tag</span>
                    <span>Products</span>
                </Link>
                <Link href="#" className={styles.navLink}>
                    <span className="material-symbols-outlined">group</span>
                    <span>Customers</span>
                </Link>
                <Link href="#" className={styles.navLink}>
                    <span className="material-symbols-outlined">bar_chart</span>
                    <span>Analytics</span>
                </Link>
                <Link href="#" className={styles.navLink}>
                    <span className="material-symbols-outlined">local_shipping</span>
                    <span>Shipments</span>
                </Link>
          </nav>
        </div>
        <div className={styles.sidebarFooter}>
            <Link href="#" className={styles.navLink}>
                <span className="material-symbols-outlined">settings</span>
                <span>Settings</span>
            </Link>
            <div className={styles.userProfile}>
                <div className={styles.avatar}>JD</div>
                <div className={styles.userInfo}>
                    <span>Jane Doe</span>
                    <span className={styles.userRole}>Admin</span>
                </div>
            </div>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <header className={styles.header}>
            <div className={styles.breadcrumbs}>
                <Link href="/admin/noob/home">Home</Link>
                <span>/</span>
                <span>Orders</span>
            </div>
            <div className={styles.headerActions}>
                <h1>Orders</h1>
                <button className={styles.exportButton}>
                    <span className="material-symbols-outlined">file_upload</span>
                    Export
                </button>
            </div>
        </header>
        <div className={styles.ordersContainer}>
            <div className={styles.ordersContent}>
                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${styles.activeTab}`}>All Orders</button>
                    <button className={styles.tab}>Unfulfilled <span className={styles.tabCount}>24</span></button>
                    <button className={styles.tab}>Unpaid</button>
                    <button className={styles.tab}>Open</button>
                </div>
                <div className={styles.filters}>
                    <div className={styles.searchWrapper}>
                        <span className="material-symbols-outlined">search</span>
                        <input type="text" placeholder="Filter orders by ID, customer, or product..." />
                    </div>
                    <div className={styles.filterButtons}>
                        <button><span className="material-symbols-outlined">filter_list</span> Status</button>
                        <button><span className="material-symbols-outlined">payments</span> Payment</button>
                        <button><span className="material-symbols-outlined">calendar_today</span> Date</button>
                        <button><span className="material-symbols-outlined">bookmark</span> Saved Views</button>
                    </div>
                </div>
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th><input type="checkbox" /></th>
                                <th>Order <span className="material-symbols-outlined">arrow_downward</span></th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th className={styles.textRight}>Total</th>
                                <th>Payment</th>
                                <th>Order Status</th>
                                <th className={styles.textRight}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>Loading...</td></tr>
                            ) : error ? (
                                <tr><td colSpan="8" style={{textAlign: 'center', padding: '2rem'}}>Error loading orders.</td></tr>
                            ) : orders.map((order) => (
                                <tr key={order.order_id}>
                                    <td><input type="checkbox" /></td>
                                    <td className={styles.orderId}><Link href={`/admin/noob/orders/${order.order_id}`}>#{order.order_id}</Link></td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <div className={styles.customerInfo}>
                                            <span>{order.user_address.full_name}</span>
                                            <span className={styles.customerLocation}>{order.user_address.city}, {order.user_address.state}</span>
                                        </div>
                                    </td>
                                    <td className={styles.textRight}>₹{order.total_amount.toFixed(2)}</td>
                                    <td><span className={`${styles.statusBadge} ${getPaymentStatusClass(order.payment_status)}`}>{order.payment_status}</span></td>
                                    <td><span className={`${styles.statusBadge} ${getOrderStatusClass(order.order_status)}`}>{order.order_status}</span></td>
                                    <td className={styles.textRight}>
                                        <button className={styles.actionButton}>
                                            <span className="material-symbols-outlined">more_horiz</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className={styles.pagination}>
                    <div className={styles.paginationInfo}>Showing <strong>1</strong> to <strong>10</strong> of <strong>{pagination.total_count}</strong> orders</div>
                    <div className={styles.paginationActions}>
                        <button disabled><span className="material-symbols-outlined">chevron_left</span></button>
                        <span>Page 1 of {Math.ceil(orders.length / 10)}</span>
                        <button><span className="material-symbols-outlined">chevron_right</span></button>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
