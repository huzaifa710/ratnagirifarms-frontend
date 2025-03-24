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
  const [mobileNumber, setMobileNumber] = useState("");
  const [token, setToken] = useState("");
  // Initialize MSG91 widget when modal opens
  useEffect(() => {
    if (isOpen && typeof window !== 'undefined' && scriptLoaded.current) {
      initializeMsg91Widget();
    }

    // Clean up when component unmounts or modal closes
    return () => {
      if (typeof window !== 'undefined' && window.sendOTP && typeof window.sendOTP.destroy === 'function') {
        window.sendOTP.destroy();
      }
    };
  }, [isOpen, scriptLoaded.current]);

  const initializeMsg91Widget = () => {
    // Clean up previous widget if it exists
    if (window.sendOTP && typeof window.sendOTP.destroy === 'function') {
      window.sendOTP.destroy();
    }

    // Create configuration for MSG91
    msg91Config.current = {
      widgetId: "356378653458333430393633", // Replace with your widget ID from .env
      tokenAuth: process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || "444589Tq8BMBtbF967defc31P1", // From your index.html
      exposeMethods: false,
      success: (data) => {
        console.log('OTP verified successfully', data);
        handleVerificationSuccess(data);

      },
      failure: (error) => {
        console.log('OTP verification failed', error);
        toast.error("Verification failed: " + (error.message || "Please try again"));
      }
    };

    // Initialize the widget
    if (window.initSendOTP) {
      window.initSendOTP(msg91Config.current);
    }
  };

  const handleScriptLoad = () => {
    scriptLoaded.current = true;
    if (isOpen) {
      initializeMsg91Widget();
    }
  };

  const handleVerificationSuccess = async (data) => {
    setLoading(true);
    try {
      // Call your backend to verify and authenticate the user
      const response = await api.post(`/users/verify-msg91`, {
        token: data.message // Pass the verification token from MSG91
      });
      
      if (response.data.success) {
        onSuccess(response.data);
        onClose();
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
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2 className={styles.title}>Login / Sign Up</h2>
        
        {/* Container for MSG91 widget - it will render its UI here */}
        <div id="msg91-widget-container" className={styles.msg91Container}></div>
        
        {/* Load MSG91 script */}
        <Script
          src="https://control.msg91.com/app/assets/otp-provider/otp-provider.js"
          onLoad={handleScriptLoad}
          strategy="lazyOnload"
        />
      </div>
    </div>
  );
}