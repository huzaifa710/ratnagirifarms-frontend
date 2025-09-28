"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";
import styles from "./page.module.css";

function SelectAddressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { uuid, accessToken } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Check if user is coming from checkout flow
  const isCheckoutFlow =
    searchParams.get("coupon") !== null || searchParams.get("current") !== null;
  const [pincodeStatus, setPincodeStatus] = useState({
    isValid: false,
    message: "",
    city: "",
  });

  const [addressForm, setAddressForm] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  useEffect(() => {
    if (!uuid && !accessToken) {
      const couponParam = searchParams.get("coupon");
      let url = "/checkout";
      if (couponParam) {
        url += `?coupon=${couponParam}`;
      }
      router.push(url);
      return;
    }
    fetchAddresses();
  }, [uuid, accessToken]);

  const fetchAddresses = async () => {
    try {
      const response = await api.get(`/user-address/${uuid}`);
      if (response.data.success && response.data.addresses) {
        setAddresses(response.data.addresses);
        // Get currently selected address from URL params
        const currentAddressId = searchParams.get("current");
        if (currentAddressId) {
          const currentAddress = response.data.addresses.find(
            (addr) => addr.id === parseInt(currentAddressId)
          );
          if (currentAddress) {
            setSelectedAddress(currentAddress);
          }
        }
      }
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch addresses");
      setLoading(false);
    }
  };

  const checkPincodeServiceability = async (pincode) => {
    try {
      const response = await api.post("/delhivery/check-pincode", {
        pincode: pincode,
      });

      if (response.data.success) {
        setPincodeStatus({
          isValid: true,
          message: response.data.message,
          city: response.data.city,
        });
        setAddressForm((prev) => ({
          ...prev,
          city: response.data.city,
        }));
      } else {
        setPincodeStatus({
          isValid: false,
          message: response.data.message,
          city: "",
        });
      }
    } catch (error) {
      setPincodeStatus({
        isValid: false,
        message: "Error checking pincode serviceability",
        city: "",
      });
      toast.error("Error checking pincode serviceability");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    const patternEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i;

    if (!patternEmail.test(addressForm.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!pincodeStatus.isValid) {
      toast.error("Please enter a valid serviceable pincode");
      return;
    }

    try {
      if (editingAddress) {
        await api.put(`/user-address/update/${editingAddress.id}`, {
          uuid,
          ...addressForm,
        });
        toast.success("Address updated successfully");
      } else {
        await api.post("/user-address/create", {
          uuid,
          ...addressForm,
        });
        toast.success("Address added successfully");
      }

      await fetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
      resetAddressForm();
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await api.delete(`/user-address/delete/${addressId}`, {
          data: { uuid },
        });
        if (selectedAddress?.id === addressId) {
          setSelectedAddress(null);
        }
        toast.success("Address deleted successfully");
        fetchAddresses();
      } catch (error) {
        toast.error("Failed to delete address");
      }
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      full_name: address.full_name,
      email: address.email,
      mobile_number: address.mobile_number,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      is_default: address.is_default,
    });
    setShowAddressForm(true);
  };

  const handleSetAsDefault = async (addressId) => {
    const response = await api.put(`/user-address/update/${addressId}`, {
      uuid,
      is_default: true,
    });
    if (response.data.success) {
      toast.success("Address set as default");
      fetchAddresses();
    } else {
      toast.error("Failed to set address as default");
    }
  };

  const resetAddressForm = () => {
    setAddressForm({
      full_name: "",
      email: "",
      mobile_number: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      is_default: false,
    });
    setPincodeStatus({
      isValid: false,
      message: "",
      city: "",
    });
  };

  const handleConfirmAddress = () => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    // Navigate back to checkout with selected address
    const couponParam = searchParams.get("coupon");
    let url = `/checkout?addressId=${selectedAddress.id}`;
    if (couponParam) {
      url += `&coupon=${couponParam}`;
    }
    router.push(url);
  };

  if (loading) {
    return <div className={styles.loading}>Loading addresses...</div>;
  }

  return (
    <div
      className={`${styles.container} ${
        isCheckoutFlow ? styles.containerWithStickyFooter : ""
      }`}
    >
      <Toaster position="top-center" />

      {/* Header */}
      <div className={styles.header}>
        <button
          onClick={() => router.back()}
          className={styles.backButton}
          aria-label="Back"
        >
          ←
        </button>
        <h1 className={styles.title}>Select Delivery Address</h1>
      </div>

      {/* Add New Address Button */}

      <div className={styles.addAddressSection}>
        <button
          onClick={() => {
            setEditingAddress(null);
            resetAddressForm();
            setShowAddressForm(true);
          }}
          className={styles.addAddressBtn}
        >
          + Add New Address
        </button>
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <form onSubmit={handleAddressSubmit} className={styles.addressForm}>
              <div className={styles.modalHeader}>
                <h3>{editingAddress ? "Edit Address" : "Add New Address"}</h3>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className={styles.closeButton}
                >
                  ×
                </button>
              </div>

              <div className={styles.modalBody}>
                <input
                  type="text"
                  placeholder="Full Name (First and Last Name)"
                  name="full_name"
                  value={addressForm.full_name}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      full_name: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={addressForm.email}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      email: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  name="mobile_number"
                  value={addressForm.mobile_number}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      mobile_number: e.target.value,
                    })
                  }
                  required
                  minLength={10}
                  maxLength={10}
                />
                <textarea
                  placeholder="Address"
                  name="address"
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, address: e.target.value })
                  }
                  required
                />
                <select
                  name="state"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, state: e.target.value })
                  }
                  required
                >
                  <option value="">Select State</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Assam">Assam</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Sikkim">Sikkim</option>
                </select>
                <div className={styles.inputGroup}>
                  <input
                    type="text"
                    placeholder="Pincode"
                    name="pincode"
                    value={addressForm.pincode}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setAddressForm({ ...addressForm, pincode: value });
                      if (value.length === 6) {
                        checkPincodeServiceability(value);
                      } else {
                        setPincodeStatus({
                          isValid: false,
                          message: "",
                          city: "",
                        });
                      }
                    }}
                    required
                    maxLength={6}
                    minLength={6}
                  />
                  {addressForm.pincode.length === 6 && (
                    <div
                      className={`${styles.pincodeStatus} ${
                        pincodeStatus.isValid ? styles.valid : styles.invalid
                      }`}
                    >
                      {pincodeStatus.message}
                    </div>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="City"
                  name="city"
                  value={addressForm.city}
                  readOnly
                  required
                />
              </div>

              <div className={styles.modalFooter}>
                <button type="submit" className={styles.saveButton}>
                  {editingAddress ? "Update" : "Add"} Address
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddressForm(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className={styles.addressList}>
        {addresses.length > 0 ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className={`${styles.addressCard} ${
                isCheckoutFlow && selectedAddress?.id === address.id
                  ? styles.selected
                  : ""
              }`}
              onClick={() => isCheckoutFlow && setSelectedAddress(address)}
            >
              <div className={styles.addressInfo}>
                <div className={styles.addressHeader}>
                  <h3 className={styles.addressName}>{address.full_name}</h3>
                  {address.is_default && (
                    <span className={styles.defaultBadge}>Default</span>
                  )}
                  {isCheckoutFlow && selectedAddress?.id === address.id && (
                    <span className={styles.selectedBadge}>Selected</span>
                  )}
                </div>
                <p className={styles.addressText}>
                  {address.address}, {address.city}, {address.state} -{" "}
                  {address.pincode}
                </p>
                <p className={styles.contactInfo}>{address.email}</p>
                <p className={styles.contactInfo}>{address.mobile_number}</p>
              </div>

              <div className={styles.addressActions}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditAddress(address);
                  }}
                  className={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddress(address.id);
                  }}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
                {!address.is_default && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSetAsDefault(address.id);
                    }}
                    className={styles.deleteBtn}
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noAddresses}>
            No addresses found. Please add a new address.
          </div>
        )}
      </div>
      {addresses.length > 0 && isCheckoutFlow && (
        <div className={styles.stickyConfirmFooter}>
          <button
            onClick={handleConfirmAddress}
            className={styles.confirmButton}
            disabled={!selectedAddress}
          >
            Confirm Address
          </button>
        </div>
      )}
    </div>
  );
}

export default function SelectAddress() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SelectAddressContent />
    </Suspense>
  );
}
