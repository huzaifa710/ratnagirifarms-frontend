"use client";
import { useState } from "react";
import styles from "./page.module.css";
import {
  FaBox,
  FaShoppingBag,
  FaTicketAlt,
  FaChevronRight,
} from "react-icons/fa";
import Link from "next/link";

export default function AdminPanel() {
  const [activeNav, setActiveNav] = useState("dashboard");

  const stats = [
    { label: "Total Orders", value: "150", icon: FaShoppingBag },
    { label: "Active Products", value: "24", icon: FaBox },
    { label: "Active Coupons", value: "8", icon: FaTicketAlt },
  ];

  return (
    <div className={styles.adminContainer}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>Dashboard Overview</h1>
        </header>

        {/* Stats Grid */}
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statIcon}>
                <stat.icon size={24} />
              </div>
              <div className={styles.statInfo}>
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <h2>Quick Actions</h2>
          <div className={styles.actionGrid}>
            <Link href="/admin/noob/orders" className={styles.actionCard}>
              <h3>View Recent Orders</h3>
              <FaChevronRight />
            </Link>
            <Link href="/admin/noob/products" className={styles.actionCard}>
              <h3>Manage Products</h3>
              <FaChevronRight />
            </Link>
            <Link href="/admin/noob/products/new" className={styles.actionCard}>
              <h3>Add New Product</h3>
              <FaChevronRight />
            </Link>
            <Link href="/admin/noob/coupons/new" className={styles.actionCard}>
              <h3>Create Coupon</h3>
              <FaChevronRight />
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
