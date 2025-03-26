"use client";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image"; // Import Image
import styles from "./page.module.css";
import { useCart } from "@/app/cart-context/page";
import { useAuth } from "@/app/auth-context/page";

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cartCount, updateCartCount } = useCart();
  const { accessToken, user, logout, setShowAuthModal } = useAuth();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    updateCartCount();

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
  };

  const handleDropdownItemClick = () => {
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
  };

  const navigationLinks = (
    <>
      <Link
        href="/"
        className={styles.navItem}
        onClick={handleDropdownItemClick}
      >
        Home
      </Link>
      <Link
        href="/products"
        className={styles.navItem}
        onClick={handleDropdownItemClick}
      >
        Products
      </Link>
      <Link
        href="/bulk-order"
        className={styles.navItem}
        onClick={handleDropdownItemClick}
      >
        Bulk Order
      </Link>
      <Link
        href="/partner-with-us"
        className={styles.navItem}
        onClick={handleDropdownItemClick}
      >
        Partner With Us
      </Link>
      <Link
        href="/contact-us"
        className={styles.navItem}
        onClick={handleDropdownItemClick}
      >
        Contact Us
      </Link>
      <Link
        href="/about-us"
        className={styles.navItem}
        onClick={handleDropdownItemClick}
      >
        About Us
      </Link>
    </>
  );

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftContainer}>
        <button
          className={styles.hamburger}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <Link href="/" className={styles.logo}>
          <Image
            src="/home/final_logo.png" // Uses the SVG logo1 file
            alt="Ratnagiri Farms"
            width={150}
            height={50}
            priority
          />
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className={styles.desktopNav}>
        <div className={styles.navLinks}>{navigationLinks}</div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`${styles.mobileNav} ${
          isMobileMenuOpen ? styles.mobileNavOpen : ""
        }`}
        ref={mobileMenuRef}
      >
        <div className={styles.mobileNavLinks}>{navigationLinks}</div>
      </div>

      {/* Cart & User Icons (Always Visible) */}
      <div className={styles.iconsContainer}>
        <Link href="/cart" className={styles.iconButton}>
          <FaShoppingCart size={20} />
          <span className={styles.cartCount}>{cartCount}</span>
        </Link>

        {/* User Dropdown (Desktop Only) */}
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
                <button
                  onClick={() => setShowAuthModal(true)}
                  className={styles.dropdownItem}
                >
                  Login/Register
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
