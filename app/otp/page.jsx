"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { toast } from "react-hot-toast";
import api from "@/utils/axios";
import { getCartFromCookie, setCartCookie } from "@/utils/cookies";
import { environment } from "@/environment";
export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [step, setStep] = useState("mobile"); // 'mobile' or 'otp'
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [testOtp, setTestOtp] = useState("");

  const handleSendOTP = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/users/send-otp`, {
        mobile_number: mobile,
      });
      if (response.data.success) {
        toast.success("OTP sent successfully!");
        setTestOtp(response.data.otp);
        setOtp(response.data.otp); // Auto-popu
        setStep("otp");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/users/verify-otp`, {
        mobile_number: mobile,
        otp,
      });
      if (response.data.success) {
        onSuccess(response.data);
        onClose();
        // window.location.reload();
      } else {
        toast.error(response?.data?.message || "Invalid OTP");
        if (
          response.data.message ===
            "Too many failed attempts. Please request new OTP" ||
          response.data.message === "Invalid or expired OTP"
        ) {
          toast.error(response.data.message);
          setStep("mobile");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
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
        <h2 className={styles.title}>
          {step === "mobile" ? "Enter Mobile Number" : "Enter OTP"}
        </h2>

        {step === "mobile" ? (
          <div className={styles.inputGroup}>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              maxLength={10}
            />
            <button
              className={styles.submitButton}
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </div>
        ) : (
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={otp} // Use otp state instead of actualOtp
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
            />
            <button
              className={styles.submitButton}
              onClick={handleVerifyOTP}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
        )}
        {/* Add this for development/testing only */}
        {environment.IS_PROD == false && testOtp && (
          <div className={styles.testOtp}>Test OTP: {testOtp}</div>
        )}
      </div>
    </div>
  );
}
