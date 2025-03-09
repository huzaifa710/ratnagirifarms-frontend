"use client";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./page.module.css";
import { useCart } from "@/app/cart-context/page";
import { useAuth } from "@/app/auth-context/page";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { cartCount, updateCartCount } = useCart();
  const { accessToken, user, logout } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    updateCartCount();

    // Add click event listener to close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const handleDropdownItemClick = () => {
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
        <div className={styles.userContainer} ref={dropdownRef}>
          <div
            onClick={() => setShowDropdown(!showDropdown)}
            className={styles.iconButton}
          >
            <FaUser size={20} />
          </div>

          {showDropdown && (
            <div className={styles.dropdown}>
              {accessToken ? (
                <>
                  <Link 
                    href="/orders" 
                    className={styles.dropdownItem}
                    onClick={handleDropdownItemClick}
                  >
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
                  <Link 
                    href="/login" 
                    className={styles.dropdownItem}
                    onClick={handleDropdownItemClick}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className={styles.dropdownItem}
                    onClick={handleDropdownItemClick}
                  >
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
