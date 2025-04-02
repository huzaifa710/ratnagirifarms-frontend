"use client";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { MapPin, Mail, Phone } from "lucide-react";
import styles from "./page.module.css";
import api from "@/utils/axios";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = "Name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mobile_number)
      newErrors.mobile_number = "Phone number is required";
    if (!formData.message) newErrors.message = "Message is required";

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
      const response = await api.post(`forms/contact-us/create`, formData);

      if (response.status === 200) {
        toast.success("Message sent successfully!");
        setFormData({
          full_name: "",
          email: "",
          mobile_number: "",
          message: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className={styles.contactContainer}>
      <Toaster position="top-center" />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className={styles.heading}>Contact Us</h1>
            <p className={styles.subheading}>Get in Touch with Us</p>
          </div>

          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <MapPin className={styles.icon} />
              <h3>Our Location</h3>
              <p>Bankot, Tal. Mandangad,</p>
              <p>District Ratnagiri, Maharashtra 415208.</p>
            </div>
            <div className={styles.infoCard}>
              <Phone className={styles.icon} />
              <h3>Phone Number</h3>
              <p>+91 84597 34158</p>
            </div>
            <div className={styles.infoCard}>
              <Mail className={styles.icon} />
              <h3>Email Address</h3>
              <p>support@ratnagirifarms.com</p>
            </div>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    name="mobile_number"
                    value={formData.mobile_number}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  {errors.phone && (
                    <p className={styles.error}>{errors.mobile_number}</p>
                  )}
                </div>
              </div>

              <div>
                <label className={styles.label}>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="4"
                  className={styles.textarea}
                />
                {errors.message && (
                  <p className={styles.error}>{errors.message}</p>
                )}
              </div>

              <button type="submit" className={styles.submitButton}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
