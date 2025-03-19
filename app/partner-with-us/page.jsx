"use client";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import styles from "./page.module.css";
import api from "@/utils/axios";

export default function PartnerWithUs() {
  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = "Full name is required";
    if (!formData.mobile_number) newErrors.mobile_number = "mobile_number number is required";
    if (!formData.email) newErrors.email = "Email is required";

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      const response = await api.post(
        `forms/partner-with-us/create`,
        formData
      );

      if (response.status === 200) {
        toast.success("Partnership request submitted successfully!");
        setFormData({
          full_name: "",
          mobile_number: "",
          email: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.partnerContainer}>
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className={styles.heading}>Partner With Us</h1>
            <p className={styles.subheading}>Join Our Network of Successful Business Partners</p>
          </div>

          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={styles.label}>Full Name *</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  {errors.full_name && (
                    <p className={styles.error}>{errors.full_name}</p>
                  )}
                </div>

                <div>
                  <label className={styles.label}>Number *</label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  {errors.mobile_number && (
                    <p className={styles.error}>{errors.mobile_number}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={styles.label}>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                />
                {errors.email && (
                  <p className={styles.error}>{errors.email}</p>
                )}
              </div>
              <div>
                <label className={styles.label}>Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className={styles.textarea}
                  placeholder="Tell us more about your business and requirements"
                />
              </div>

              <button type="submit" className={styles.submitButton}>
                Submit Partnership Request
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}