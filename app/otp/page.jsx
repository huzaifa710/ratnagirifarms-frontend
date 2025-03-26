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
  const [verificationComplete, setVerificationComplete] = useState(false);

  // Initialize MSG91 widget when modal opens
  useEffect(() => {
    if (
      isOpen &&
      typeof window !== "undefined" &&
      scriptLoaded.current &&
      !isClosing &&
      !verificationComplete // Don't re-initialize if verification is complete
    ) {
      initializeMsg91Widget();
    }

    // Clean up when component unmounts or modal closes
    return () => {
      cleanupWidget();
    };
  }, [isOpen, scriptLoaded.current, isClosing, verificationComplete]);

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

    // Force a longer delay to ensure widget is properly destroyed
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const initializeMsg91Widget = () => {
    // Don't initialize if verification is already complete
    if (verificationComplete) return;

    // Clean up previous widget if it exists
    cleanupWidget();

    // Create configuration for MSG91
    msg91Config.current = {
      widgetId: "356378653458333430393633",
      tokenAuth: process.env.NEXT_PUBLIC_MSG91_TOKEN_AUTH || "{token}",
      exposeMethods: false,
      containerId: "msg91-widget-container",
      success: (data) => {
        handleVerificationSuccess(data);
      },
      failure: (error) => {
        toast.error(
          "Verification failed: " + (error.message || "Please try again")
        );
        handleSafeClose();
      },
      beforeClose: () => {
        return true;
      },
      afterClose: () => {
        handleSafeClose();
      },
    };

    setTimeout(() => {
      if (
        window.initSendOTP &&
        document.getElementById("msg91-widget-container") &&
        !verificationComplete
      ) {
        try {
          window.initSendOTP(msg91Config.current);
        } catch (error) {
          console.error("Error initializing MSG91 widget:", error);
        }
      }
    }, 200);
  };

  const handleScriptLoad = () => {
    scriptLoaded.current = true;
    if (isOpen && !isClosing && !verificationComplete) {
      initializeMsg91Widget();
    }
  };

  const handleVerificationSuccess = async (data) => {
    setLoading(true);

    // Mark verification as complete immediately to prevent re-initialization
    setVerificationComplete(true);

    try {
      // First clean up the widget to prevent re-initialization
      cleanupWidget();

      // Call your backend to verify and authenticate the user
      const response = await api.post(`/users/verify-msg91`, {
        mobile_number: data.phone || data.mobile || data.identifier,
        token: data.message || data.token,
      });

      if (response.data.success) {
        // Process the success response
        onSuccess(response.data);

        // Close the modal afterward
        handleSafeClose();
      } else {
        toast.error(response?.data?.message || "Verification failed");
        setVerificationComplete(false); // Reset on failure
        handleSafeClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Authentication failed");
      setVerificationComplete(false); // Reset on failure
      handleSafeClose();
    } finally {
      setLoading(false);
    }
  };

  // Reset verification state when modal reopens
  useEffect(() => {
    if (isOpen) {
      setVerificationComplete(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.authModalOverlay}>
      <div className={styles.authModalContent}>
        <div id="msg91-widget-container"></div>

        <Script
          src="https://control.msg91.com/app/assets/otp-provider/otp-provider.js"
          onLoad={handleScriptLoad}
          strategy="lazyOnload"
        />

        {(loading || isClosing) && (
          <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
          </div>
        )}
      </div>
    </div>
  );
}
