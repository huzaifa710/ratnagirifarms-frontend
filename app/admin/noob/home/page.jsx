'use client';
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import Link from "next/link";
import api from "../../../../utils/axios";
import { toast } from "react-hot-toast";

const getDashboardStats = async () => {
  // This is a mock function, replace with actual API call if needed
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    totalOrders: { value: "1,245", change: "+5.2%", changeType: "positive" },
    totalRevenue: { value: "$45,230", change: "+12.5%", changeType: "positive" },
    pendingShipments: { value: "34", change: "Delayed", changeType: "neutral" },
    activeCoupons: { value: "12", change: "-1", changeType: "negative" },
  };
};

const getRecentOrders = async () => {
  try {
    const response = await api.post("/orders/all", { limit: 5 });
    if (response.data.success) {
      return response.data.orders;
    } else {
      toast.error(response.data.message || "Failed to fetch recent orders.");
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch recent orders:", error);
    toast.error("Failed to fetch recent orders.");
    return [];
  }
};

const StatCard = ({ title, value, change, changeType, icon, iconBgColor }) => {
    let changeIcon;
    let changeClass;

    switch (changeType) {
        case 'positive':
            changeIcon = 'trending_up';
            changeClass = styles.positiveChange;
            break;
        case 'negative':
            changeIcon = 'trending_down';
            changeClass = styles.negativeChange;
            break;
        case 'neutral':
            changeIcon = 'remove';
            changeClass = styles.neutralChange;
            break;
        default:
            changeIcon = '';
            changeClass = '';
    }

    const footerTextMap = {
        'positive': 'vs last week',
        'negative': 'expiring today',
        'neutral': 'needs attention',
    };

    return (
        <div className={styles.statCard}>
            <div className={styles.statCardHeader}>
                <div>
                    <p>{title}</p>
                    <h3>{value}</h3>
                </div>
                <div className={`${styles.statIcon} ${iconBgColor}`}>
                    <span className={`material-symbols-outlined icon`}>{icon}</span>
                </div>
            </div>
            <div className={styles.statCardFooter}>
                 {changeIcon && <span className={`material-symbols-outlined icon ${changeClass}`}>{changeIcon}</span>}
                <span className={changeClass}>{change}</span>
                <span className={styles.footerText}>{footerTextMap[changeType]}</span>
            </div>
        </div>
    );
};

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
        case 'paid': return styles.statusDelivered;
        case 'unpaid': return styles.statusProcessing;
        case 'pending': return styles.statusProcessing;
        case 'refunded': return styles.statusCancelled;
        default: return '';
    }
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, ordersData] = await Promise.all([
          getDashboardStats(),
          getRecentOrders(),
        ]);
        setStats(statsData);
        setRecentOrders(ordersData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.sidebarHeader}>
            <div className={styles.logo}>
              <span className={`material-symbols-outlined ${styles.logoIcon}`}>agriculture</span>
            </div>
            <div className={styles.titleWrapper}>
              <h1>Ratnagiri Farms</h1>
              <p>Admin Panel</p>
            </div>
          </div>
          <nav className={styles.navMenu}>
            <p className={styles.menuTitle}>Menu</p>
            <Link href="/admin/noob/home" className={`${styles.navLink} ${styles.active}`}>
              <span className="material-symbols-outlined icon">dashboard</span>
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/noob/orders" className={styles.navLink}>
              <span className="material-symbols-outlined icon">shopping_bag</span>
              <span>Orders</span>
            </Link>
            <Link href="#" className={styles.navLink}>
              <span className="material-symbols-outlined icon">inventory_2</span>
              <span>Inventory</span>
            </Link>
            <Link href="#" className={styles.navLink}>
              <span className="material-symbols-outlined icon">group</span>
              <span>Customers</span>
            </Link>
            <Link href="#" className={styles.navLink}>
               <span className="material-symbols-outlined icon">bar_chart</span>
               <span>Analytics</span>
            </Link>
          </nav>
        </div>
        <div className={styles.sidebarFooter}>
            <div className={styles.userProfile}>
                <div 
                    className={styles.avatar} 
                    style={{backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD8HmSCl6dl9VFSb0e_C8JrZoXFvqlbUQ_jZFT9KNQZJC_Wb94SqrQNyW9psctnr2iOp0nRNMukhUOcrrWWzJhgsHd-rPnMhTCpN6viuPAQCgtnUpZFRroChit4xEmMCJm6AU0D9xJ_mgC53Ta7g70UevmRfpGMHkUgVUjmAFbvAhY_LYsGnu5P08gITI_Yu5Qqgg9jOydB0U9I21QKW76xjTieXW_qTabcy3G5LaCSi80LKZkG3TkBnv4mWpH-cqHabLFuxqddNUA')`}}
                ></div>
                <div className={styles.userInfo}>
                    <p>Suresh K.</p>
                    <p>Manager</p>
                </div>
                 <span className="material-symbols-outlined icon">expand_more</span>
            </div>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <header className={styles.header}>
            <div>
                <h2>Dashboard Overview</h2>
                <p>Welcome back, here's what's happening at the farm today.</p>
            </div>
        </header>
        

        <div className={styles.contentArea}>
            <div className={styles.contentWrapper}>
                {loading ? <p>Loading...</p> : stats &&
                    <div className={styles.statsGrid}>
                        <StatCard 
                            title="Total Orders" 
                            value={stats.totalOrders.value}
                            change={stats.totalOrders.change}
                            changeType={stats.totalOrders.changeType}
                            icon="shopping_cart"
                            iconBgColor={styles.totalOrdersIcon}
                        />
                         <StatCard 
                            title="Total Revenue" 
                            value={stats.totalRevenue.value}
                            change={stats.totalRevenue.change}
                            changeType={stats.totalRevenue.changeType}
                            icon="payments"
                            iconBgColor={styles.totalRevenueIcon}
                        />
                         <StatCard 
                            title="Pending Shipments" 
                            value={stats.pendingShipments.value}
                            change={stats.pendingShipments.change}
                            changeType={stats.pendingShipments.changeType}
                            icon="local_shipping"
                            iconBgColor={styles.pendingShipmentsIcon}
                        />
                         <StatCard 
                            title="Active Coupons" 
                            value={stats.activeCoupons.value}
                            change={stats.activeCoupons.change}
                            changeType={stats.activeCoupons.changeType}
                            icon="sell"
                            iconBgColor={styles.activeCouponsIcon}
                        />
                    </div>
                }

                <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                        <h3>Recent Orders</h3>
                        <Link href="/admin/noob/orders" className={styles.viewAllBtn}>View All</Link>
                    </div>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    {/* <th>Product</th> */}
                                    <th>Amount</th>
                                    <th>Order Status</th>
                                    <th>Payment Status</th>
                                    <th className={styles.actionCell}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>Loading recent orders...</td></tr>
                                ) : recentOrders && recentOrders.length > 0 ? (
                                    recentOrders.map((order) => (
                                    <tr key={order.order_id}>
                                        <td className={styles.orderId}>{order.order_id}</td>
                                        <td className={styles.customerName}>{order.user_address?.full_name || 'N/A'}</td>
                                        {/* <td className={styles.productName}>
                                            <div className={styles.productCell}>
                                                <div className={`${styles.productIcon} ${styles.mangoIcon}`}>-</div>
                                                {order.products?.length > 0 ? `${order.products[0].product.name.substring(0, 20)}...` : 'N/A'}
                                            </div>
                                        </td> */}
                                        <td className={styles.amount}>₹{order.total_amount}</td>
                                        <td><span className={`${styles.statusBadge} ${getOrderStatusClass(order.order_status)}`}>{order.order_status}</span></td>
                                        <td><span className={`${styles.statusBadge} ${getPaymentStatusClass(order.payment_status)}`}>{order.payment_status}</span></td>

                                        <td className={styles.actionCell}>
                                            <button className={styles.actionBtn}>
                                                <span className="material-symbols-outlined icon">more_vert</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                                ) : (
                                    <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No recent orders found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
