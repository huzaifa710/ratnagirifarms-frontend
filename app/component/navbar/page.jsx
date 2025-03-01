"use client"

import React, { useState } from "react";
import Link from "next/link";
import { FaCartShopping } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import styles from "./page.module.css";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className={styles.navbar}>
      <ul>
        <li>
          <Link href="/" className={styles.active}>
            Home
          </Link>
        </li>
        <li>
          <Link href="/ratnagiri-alphonso">
            Ratnagiri Alphonso
          </Link>
        </li>
        <li>
          <Link href="/bulk-order">
            Bulk Order
          </Link>
        </li>
        <li>
          <Link href="/partner-with-us">
            Partner With Us
          </Link>
        </li>
        <li>
          <Link href="/contact-us">
            Contact Us
          </Link>
        </li>
        <li className={styles.cartIcon}>
          <Link href="/cart">
            <FaCartShopping className={styles.icon} />
          </Link>
        </li>
        <li className={styles.userIcon}>
          <div onClick={() => setShowDropdown(!showDropdown)}>
            <FaUser className={styles.icon} />
            {showDropdown && (
              <div className={styles.dropdown}>
                <Link href="/login" className="text-red-400">Login</Link>
                <Link href="/register" className="text-red-400">Register</Link>
              </div>
            )}
          </div>
        </li>
      </ul>
    </nav>
  );
}