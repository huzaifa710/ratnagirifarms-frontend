"use client";
import { useState, useEffect } from "react";
import ClientPortal from "../client-portal/page";
import api from "@/utils/axios";
import { toast } from "react-hot-toast";
import styles from "./page.module.css";
import { FaBell } from "react-icons/fa"; // Import bell icon

export default function NotifyModal({ productName, variantId, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Load email from localStorage when component mounts
  useEffect(() => {
    const savedEmail = localStorage.getItem("notify_email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/notify/create", {
        email,
        product_variant_id: variantId,
      });

      if (response.data.success) {
        localStorage.setItem("notify_email", email);
        toast.success(
          "Thank you! We'll notify you when this product is back in stock."
        );
        onClose(true, email);
      } else {
        toast.error(response.data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("Failed to set notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose(false);
  };

  return (
    <ClientPortal>
      <div className={styles.modalOverlay} onClick={onClose}>
        <div
          className={styles.modalContent}
          onClick={(e) => e.stopPropagation()}
        >
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
          <h2 className={styles.title}>Get Notified</h2>
          <p className={styles.description}>
            We'll email you when this is back in stock.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className={styles.emailInput}
            />
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <FaBell className={styles.bellIcon} />
                  <span>Notify</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </ClientPortal>
  );
}
