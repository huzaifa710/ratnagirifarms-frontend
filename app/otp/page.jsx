"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { toast } from "react-hot-toast";
import api from "@/utils/axios";
import Script from "next/script";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const msg91Config = useRef(null);
  const scriptLoaded = useRef(false);
  const [isClosing, setIsClosing] = useState(false);

  // Initialize MSG91 widget when modal opens
  useEffect(() => {
    if (
      isOpen &&
      typeof window !== "undefined" &&
      scriptLoaded.current &&
      !isClosing
    ) {
      initializeMsg91Widget();
    }

    // Clean up when component unmounts or modal closes
    return () => {
      cleanupWidget();
    };
  }, [isOpen, scriptLoaded.current, isClosing]);

  // Clean up widget safely
  const cleanupWidget = () => {
    if (
      typeof window !== "undefined" &&
      window.sendOTP &&
      typeof window.sendOTP.destroy === "function"
    ) {
      try {
        window.sendOTP.destroy();
      } catch (error) {
        console.error("Error cleaning up MSG91 widget:", error);
      }
    }
  };

  // Safe modal close with widget cleanup
  const handleSafeClose = () => {
    setIsClosing(true);
    cleanupWidget();

    // Add a small delay before actually closing the modal
    // This gives the widget time to clean up properly
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 100);
  };

  const initializeMsg91Widget = () => {
    // Clean up previous widget if it exists
    cleanupWidget();

    // Create configuration for MSG91
    msg91Config.current = {
      widgetId: "356378653458333430393633", // Replace with your widget ID from .env
      tokenAuth: process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH,
      exposeMethods: false,
      containerId: "msg91-widget-container", // Explicitly specify container ID
      success: (data) => {
        console.log("OTP verified successfully", data);
        handleVerificationSuccess(data);
      },
      failure: (error) => {
        console.log("OTP verification failed", error);
        toast.error(
          "Verification failed: " + (error.message || "Please try again")
        );
        handleSafeClose();
      },
      beforeClose: () => {
        // Called before the widget closes
        console.log("Widget about to close");
        return true; // Return true to allow closing
      },
      afterClose: () => {
        // Called after the widget is closed
        console.log("Widget closed");
        handleSafeClose();
      },
    };

    // Initialize the widget with a small delay to ensure DOM is ready
    setTimeout(() => {
      if (
        window.initSendOTP &&
        document.getElementById("msg91-widget-container")
      ) {
        try {
          window.initSendOTP(msg91Config.current);
        } catch (error) {
          console.error("Error initializing MSG91 widget:", error);
        }
      }
    }, 100);
  };

  const handleScriptLoad = () => {
    scriptLoaded.current = true;
    if (isOpen && !isClosing) {
      initializeMsg91Widget();
    }
  };

  const handleVerificationSuccess = async (data) => {
    setLoading(true);
    try {
      // Call your backend to verify and authenticate the user
      const response = await api.post(`/users/verify-msg91`, {
        mobile_number: data.phone || data.mobile,
        token: data.message || data.token, // Pass the verification token from MSG91
      });

      if (response.data.success) {
        onSuccess(response.data);
        handleSafeClose();
      } else {
        toast.error(response?.data?.message || "Verification failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button
          className={styles.closeButton}
          onClick={handleSafeClose}
          disabled={isClosing || loading}
        >
          ×
        </button>
        <h2 className={styles.title}>Login / Sign Up</h2>

        {/* Container for MSG91 widget - it will render its UI here */}
        <div
          id="msg91-widget-container"
          className={styles.msg91Container}
        ></div>

        {/* Load MSG91 script */}
        <Script
          src="https://control.msg91.com/app/assets/otp-provider/otp-provider.js"
          onLoad={handleScriptLoad}
          strategy="lazyOnload"
        />

        {/* Loading overlay if needed */}
        {(loading || isClosing) && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
      </div>
    </div>
  );
}
