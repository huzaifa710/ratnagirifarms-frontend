"use client";
import React, { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import styles from "./page.module.css"; // Import CSS module
import api from "@/utils/axios";

export default function BulkOrder() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    mangoType: "",
    sixPieceQuantity: "",
    twelvePieceQuantity: "",
    twentyFourPieceQuantity: "",
    mangoSize: "",
    city: "",
    message: "",
  });

  const createBulkOrder = async (bulkOrderDate) => {
    try {
      const response = await api.post(
        `/forms/bulk-orders/create`,
        bulkOrderDate
      );
      return response;
    } catch (error) {
      toast.error("Error while creating bulk order");
    }
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName) newErrors.fullName = "Full name is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.mangoType) newErrors.mangoType = "Please select mango type";
    if (!formData.mangoSize) newErrors.mangoSize = "Please select mango size";
    if (!formData.city) newErrors.city = "City is required";

    // Email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    try {
      const boxTypes = [];
      if (formData.twelvePieceQuantity) boxTypes.push("12 piece");
      if (formData.twentyFourPieceQuantity) boxTypes.push("24 piece");

      const totalQuantity =
        (Number(formData.sixPieceQuantity) || 0) +
        (Number(formData.twelvePieceQuantity) || 0) +
        (Number(formData.twentyFourPieceQuantity) || 0);

      const bulkCreateData = {
        full_name: formData.fullName,
        email: formData.email,
        mobile_number: formData.phone,
        type_of_mango: formData.mangoType,
        type_of_box: boxTypes.join(","),
        quantity: totalQuantity.toString(),
        size_of_mango: formData.mangoSize,
        message: formData.message || "",
        city: formData.city,
      };

      const response = await createBulkOrder(bulkCreateData);

      if (response.status == 200) {
        toast.success("Bulk order request submitted successfully");
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          mangoType: "",
          sixPieceQuantity: "",
          twelvePieceQuantity: "",
          twentyFourPieceQuantity: "",
          mangoSize: "",
          city: "",
          message: "",
        });
      } else {
        toast.error("Failed to submit bulk order. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className={styles.bulkOrderContainer}>
      <Toaster position="top-center" />
      <h1 className={styles.title}>Bulk Order</h1>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={styles.input}
              />
              {errors.fullName && (
                <p className={styles.error}>{errors.fullName}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={styles.input}
              />
              {errors.phone && <p className={styles.error}>{errors.phone}</p>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Mango Type *</label>
              <select
                name="mangoType"
                value={formData.mangoType}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select mango type</option>
                <option value="haapus">Haapus</option>
                <option value="pairi">Payari/Pairi</option>
              </select>
              {errors.mangoType && (
                <p className={styles.error}>{errors.mangoType}</p>
              )}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Mango Size *</label>
              <select
                name="mangoSize"
                value={formData.mangoSize}
                onChange={handleChange}
                className={styles.select}
              >
                <option value="">Select mango size</option>
                <option value="regular">Regular</option>
                <option value="queen">Queen</option>
                <option value="king">King</option>
              </select>
              {errors.mangoSize && (
                <p className={styles.error}>{errors.mangoSize}</p>
              )}
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>12 Piece Box Quantity</label>
              <input
                type="number"
                name="twelvePieceQuantity"
                value={formData.twelvePieceQuantity}
                onChange={handleChange}
                min="0"
                className={styles.input}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>24 Piece Box Quantity</label>
              <input
                type="number"
                name="twentyFourPieceQuantity"
                value={formData.twentyFourPieceQuantity}
                onChange={handleChange}
                min="0"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={styles.input}
              />
              {errors.city && <p className={styles.error}>{errors.city}</p>}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Message (Optional)</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className={styles.textarea}
              placeholder="Any special requirements or questions?"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit Bulk Order Request
          </button>
        </form>
      </div>
    </div>
  );
}
