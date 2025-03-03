"use client";
import React, { useState } from "react";
import { environment } from "@/environment";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import styles from "./page.module.css"; // Import CSS module

export default function BulkOrder() {
  const [formData, setFormData] = useState({
    fullName: "HUZAIFA",
    phone: "8888888888",
    email: "noorihuzaifa@gmail.com",
    mangoType: "ratnagiri",
    sixPieceQuantity: "2",
    twelvePieceQuantity: "2",
    twentyFourPieceQuantity: "4",
    mangoSize: "king",
    city: "Mumbai",
    message: "",
  });

  const createBulkOrder = async (bulkOrderDate) => {
    try {
      const response = await axios.post(
        `${environment.API_URL}/bulk-orders/create`,
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
      if (formData.sixPieceQuantity) boxTypes.push("6 piece");
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
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 3000,
            style: {
              background: "green",
            },
          },
          error: {
            duration: 3000,
            style: {
              background: "red",
            },
          },
        }}
      />
      <div className={`min-h-screen ${styles.bulkOrderContainer}`}>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className={`text-4xl font-bold mb-4 ${styles.heading}`}>Bulk Order</h1>
              <p className={`text-xl ${styles.subheading}`}>Start Your Own Store</p>
              <p className={`text-2xl font-semibold ${styles.primaryText}`}>
                100% Naturally Ripen Alphonso Mango
              </p>
            </div>
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={styles.label}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={styles.label}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.input}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className={styles.label}>
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* <div>
                  <label className={styles.label}>
                    Types of Mango *
                  </label>
                  <select
                    name="mangoType"
                    value={formData.mangoType}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Select mango type</option>
                    <option value="ratnagiri">Ratnagiri</option>
                    <option value="devgad">Devgad</option>
                    <option value="others">Others</option>
                  </select>
                  {errors.mangoType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mangoType}
                    </p>
                  )}
                </div> */}

                <div className="space-y-4">
                  <h3 className={styles.subheading}>Type of Box *</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className={styles.label}>
                        6 piece
                      </label>
                      <input
                        type="number"
                        name="sixPieceQuantity"
                        value={formData.sixPieceQuantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        min="0"
                        className={styles.input}
                      />
                    </div>

                    <div>
                      <label className={styles.label}>
                        12 piece
                      </label>
                      <input
                        type="number"
                        name="twelvePieceQuantity"
                        value={formData.twelvePieceQuantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        min="0"
                        className={styles.input}
                      />
                    </div>

                    <div>
                      <label className={styles.label}>
                        24 piece
                      </label>
                      <input
                        type="number"
                        name="twentyFourPieceQuantity"
                        value={formData.twentyFourPieceQuantity}
                        onChange={handleChange}
                        placeholder="Quantity"
                        min="0"
                        className={styles.input}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={styles.label}>
                    Sizes of Mango *
                  </label>
                  <select
                    name="mangoSize"
                    value={formData.mangoSize}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="">Select size</option>
                    <option value="king">King</option>
                    <option value="queen">Queen</option>
                    <option value="regular">Regular</option>
                  </select>
                  {errors.mangoSize && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mangoSize}
                    </p>
                  )}
                </div>

                <div>
                  <label className={styles.label}>City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={styles.input}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className={styles.label}>
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Add any additional requirements or questions"
                    className={styles.textarea}
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
