"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { toast } from "react-hot-toast";
import styles from "./page.module.css";
import { FaTag, FaCopy } from "react-icons/fa";

export default function AvailableCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const { uuid, accessToken } = useAuth();

  useEffect(() => {
    fetchAvailableCoupons();
  }, [uuid]);

  const fetchAvailableCoupons = async () => {
    try {
      // For guest users, fetch public coupons
      const endpoint = uuid ? `/coupons/available/${uuid}` : "/coupons/all";
      const response = await api.get(endpoint);

      if (response.data.success) {
        setCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => toast.success(`Copied code: ${code}`))
      .catch(() => toast.error("Failed to copy code"));
  };

  if (loading) {
    return <div className={styles.loading}>Loading offers...</div>;
  }

  if (coupons.length === 0) {
    return null; // Don't show section if no coupons
  }

  return (
    <div className={styles.couponsContainer}>
      <div className={styles.couponsList}>
        {coupons.map((coupon) => (
          <div key={coupon.id} className={styles.couponCard}>
            <div className={styles.couponBadge}>
              <FaTag />
            </div>
            <div className={styles.couponHeader}>
              <div className={styles.couponCode}>{coupon.code}</div>
              <button
                className={styles.copyButton}
                onClick={() => handleCopyCode(coupon.code)}
                title="Copy code"
              >
                <FaCopy />
              </button>
            </div>
            <div className={styles.discountValue}>
              {coupon.discount_type === "percentage"
                ? `${coupon.discount_value}% OFF`
                : `₹${coupon.discount_value} OFF`}
            </div>
            <div className={styles.couponDetails}>
              {coupon.min_order_value > 0 && (
                <p>Min. Order: ₹{coupon.min_order_value}</p>
              )}
              {coupon.max_discount_value > 0 &&
                coupon.discount_type === "percentage" && (
                  <p>Max Discount: ₹{coupon.max_discount_value}</p>
                )}
            </div>
            <div className={styles.couponDetails}>
              {uuid && (
                <p className={styles.usageInfo}>
                  Remaing usage: {coupon.remaining_uses}
                </p>
              )}
            </div>
            <div className={styles.couponFooter}>
              {coupon.expiry_date && (
                <p className={styles.expiryDate}>
                  Valid till:{" "}
                  {new Date(coupon.expiry_date).toISOString().split("T")[0]}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
