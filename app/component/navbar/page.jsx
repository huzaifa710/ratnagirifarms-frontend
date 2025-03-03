"use client";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useCart } from "@/app/cart-context/page";
import { useAuth } from "@/app/auth-context/page";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { cartCount, updateCartCount } = useCart();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    updateCartCount();
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      {/* <div className={styles.logo}>Ratnagiri Farms</div> */}

      {/* Navigation Links */}
      <div className={styles.navLinks}>
        <Link href="/" className={styles.navItem}>
          Home
        </Link>
        <Link href="/ratnagiri-alphonso" className={styles.navItem}>
          Ratnagiri Alphonso
        </Link>
        <Link href="/bulk-order" className={styles.navItem}>
          Bulk Order
        </Link>
        <Link href="/partner-with-us" className={styles.navItem}>
          Partner With Us
        </Link>
        <Link href="contact-us" className={styles.navItem}>
          Contact Us
        </Link>
      </div>

      {/* Cart & User Icons */}
      <div className={styles.iconsContainer}>
        {/* Cart Button */}
        <Link href="/cart" className={styles.iconButton}>
          <FaShoppingCart size={20} />
          <span className={styles.cartCount}>{cartCount}</span>
        </Link>
        {/* User Dropdown */}
        <div className={styles.userContainer}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className={styles.iconButton}
          >
            <FaUser size={20} />
          </div>

          {showDropdown && (
            <div className={styles.dropdown}>
              {isAuthenticated ? (
                <>
                  <span className={styles.dropdownItem}>{user?.name}</span>
                  <Link href="/profile" className={styles.dropdownItem}>
                    Profile
                  </Link>
                  <Link href="/orders" className={styles.dropdownItem}>
                    Orders
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={styles.dropdownItem}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.dropdownItem}>
                    Login
                  </Link>
                  <Link href="/register" className={styles.dropdownItem}>
                    Register
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
