"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/cart-context/page";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";
import styles from "./page.module.css";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import Link from "next/link";

export default function Checkout() {
  const router = useRouter();
  const { uuid, accessToken, mobile_number, setShowAuthModal } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editingAddress, setEditingAddress] = useState(null);
  const { guestCart, updateCartCount, addToGuestCart, removeFromGuestCart } =
    useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [addressForm, setAddressForm] = useState({
    full_name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    is_default: false,
  });

  useEffect(() => {
    if (!uuid && !accessToken) {
      setShowAuthModal(true);
      return;
    }

    if (!uuid && !accessToken) {
      setCartItems(guestCart);
      setLoading(false);
    } else {
      fetchCartItems();
      fetchAddresses();
    }
  }, [uuid, accessToken]);

  const fetchCartItems = async () => {
    try {
      const response = await api.get(`/carts/by-uuid/${uuid}`);
      setCartItems(response.data.cartItems);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch cart items");
      setLoading(false);
    }
  };

  // Add this function to handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const response = await api.post("/coupons/apply", {
        uuid,
        code: couponCode,
        order_total: cartItems.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
      });

      if (response.data.success) {
        setDiscount(response.data.discount);
        setAppliedCoupon(response.data.coupon);
        toast.success(`Coupon applied! You saved ₹${response.data.discount}`);
      } else {
        toast.error(response.data.message || "Invalid coupon");
      }
    } catch (error) {
      console.error("Coupon application error:", error);
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  };

  // Add this function to handle coupon removal
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setAppliedCoupon(null);
    toast.success("Coupon removed");
  };

  const fetchAddresses = async () => {
    try {
      const response = await api.get(`/user-address/${uuid}`);
      if (
        response.data.success &&
        response.data.addresses &&
        response.data.addresses.length > 0
      ) {
        setAddresses(response.data.addresses);
        // Set default address as selected if exists
        const defaultAddress = response.data.addresses.find(
          (addr) => addr.is_default
        );
        if (defaultAddress) setSelectedAddress(defaultAddress);
      } else {
        setAddresses([]);
        setSelectedAddress(null);
      }
    } catch (error) {
      toast.error("Failed to fetch addresses");
    }
  };

  const handleAddToCart = async (product_variant_id) => {
    if (!uuid || !accessToken) {
      const product = cartItems.find(
        (item) => item.product_variant_id === product_variant_id
      );
      if (product) {
        addToGuestCart(product);
        await fetchCartItems();
        toast.success("Added to cart");
      }
      return;
    }

    try {
      await api.post(`/carts/add`, {
        uuid,
        product_variant_id,
        quantity: 1,
      });
      toast.success("Added to cart");
      await fetchCartItems();
      await updateCartCount();
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    }
  };

  const removeFromCart = async (product_variant_id, quantity) => {
    if (!uuid && !accessToken) {
      removeFromGuestCart(product_variant_id, quantity);
      await fetchCartItems();
      await updateCartCount();
      toast.success("Item removed from cart");
      return;
    }

    try {
      const payload = { uuid, product_variant_id, quantity };
      await api.post(`/carts/remove`, payload);
      toast.success("Item removed from cart");
      await fetchCartItems();
      await updateCartCount();
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
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
      fetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({
        full_name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        is_default: false,
      });
    } catch (error) {
      toast.error("Failed to save address");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await api.delete(`/user-address/delete/${addressId}`, {
        data: { uuid },
      });
      toast.success("Address deleted successfully");
      fetchAddresses();
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm({
      full_name: address.full_name,
      email: address.email,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      is_default: address.is_default,
    });
    setShowAddressForm(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      // Create guest order or regular order based on checkout type
      const createOrderResponse = await api.post("orders/create", {
        uuid,
        cart_ids: cartItems.map((item) => item.id),
        user_address_id: selectedAddress.id,
        coupon_id: appliedCoupon ? appliedCoupon.id : null,
      });

      // Initialize Razorpay with appropriate details
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: createOrderResponse.data.amount,
        currency: "INR",
        name: "Ratnagiri Farms",
        description: "Order Payment",
        order_id: createOrderResponse.data.razorpay_order_id,
        prefill: {
          name: selectedAddress.full_name,
          email: selectedAddress.email,
          contact: mobile_number,
        },
        handler: async (response) => {
          try {
            const verifyResponse = await api.post("/orders/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResponse.data.success) {
              toast.success("Payment successful!");
              router.push("/orders");
            }
          } catch (error) {
            toast.error("Payment verification failed");
          }
        },
        theme: {
          color: "#e5c07b",
        },
      };
      // Load Razorpay script
      const loadRazorpay = () => {
        return new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        toast.error("Razorpay SDK failed to load");
        return;
      }

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to create order");
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.checkoutContainer}>
      <Toaster position="top-center" />
      <h1 className={styles.title}>Checkout</h1>
      <div className={styles.checkoutContent}>
        <div className={styles.addressSection}>
          <div className={styles.addressHeader}>
            {addresses.length == 0 ? (
              <h2 className={styles.Message}>
                {" "}
                Please add new address to proceed with the order
              </h2>
            ) : (
              <h2 className={styles.Message}> Delivery Address</h2>
            )}
            <button
              onClick={() => {
                setShowAddressForm(true);
                setEditingAddress(null);
                setAddressForm({
                  full_name: "",
                  email: "",
                  address: "",
                  city: "",
                  state: "",
                  pincode: "",
                  is_default: false,
                });
              }}
              className={styles.addAddressBtn}
            >
              Add New Address
            </button>
          </div>

          {showAddressForm && (
            <form onSubmit={handleAddressSubmit} className={styles.addressForm}>
              <h3>{editingAddress ? "Edit Address" : "Add New Address"}</h3>
              <input
                type="text"
                placeholder="Full Name (First and Last Name"
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
                type="text"
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
              <textarea
                placeholder="Address"
                name="address"
                value={addressForm.address}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, address: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="City"
                name="city"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="State"
                name="state"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Pincode"
                name="pincode"
                value={addressForm.pincode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, pincode: e.target.value })
                }
                required
                maxLength={6}
              />
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={addressForm.is_default}
                  onChange={(e) =>
                    setAddressForm({
                      ...addressForm,
                      is_default: e.target.checked,
                    })
                  }
                />
                Set as default address
              </label>
              <div className={styles.formButtons}>
                <button type="submit">
                  {editingAddress ? "Update" : "Add"} Address
                </button>
                <button type="button" onClick={() => setShowAddressForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className={styles.addressList}>
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`${styles.addressCard} ${
                  selectedAddress?.id === address.id ? styles.selected : ""
                }`}
                onClick={() => setSelectedAddress(address)}
              >
                <div className={styles.addressInfo}>
                  <p>{address.full_name}</p>
                  <p>{address.email}</p>
                  <p>{address.address}</p>
                  <p>
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <div className={styles.addressActions}>
                    {address.is_default && (
                      <span className={styles.defaultBadge}>Default</span>
                    )}
                    <div className={styles.actionButtons}>
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
                    </div>
                  </div>
                </div>
                {/* <div className={styles.addressActions}>
                  <button onClick={() => handleEditAddress(address)}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteAddress(address.id)}>
                    Delete
                  </button>
                </div> */}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.productSummaryContainer}>
          <div className={styles.itemsList}>
            {cartItems.map((item) => (
              <div key={item.product_variant_id} className={styles.orderItem}>
                <div className={styles.itemInfo}>
                  <h3>{item.name}</h3>
                  <p>No Of Pieces Per Box : {item.quantity_per_box}</p>
                  <div className={styles.quantityControl}>
                    <button
                      onClick={() => removeFromCart(item.product_variant_id, 1)}
                      disabled={item.quantity <= 1}
                      className={styles.quantityBtn}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleAddToCart(item.product_variant_id)}
                      className={styles.quantityBtn}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <div className={styles.itemPrice}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() =>
                      removeFromCart(item.product_variant_id, item.quantity)
                    }
                    className={styles.removeBtn}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>
            <div className={styles.summaryDetails}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>
                  ₹
                  {cartItems
                    .reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
              <div className={styles.summaryRow}>
                <span>Delivery Charges</span>
                <span>₹0.00</span>
              </div>

              {appliedCoupon ? (
                <div className={styles.couponApplied}>
                  <div className={styles.summaryRow}>
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className={styles.removeCouponBtn}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.couponRow}>
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className={styles.couponInput}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className={styles.applyCouponBtn}
                  >
                    Apply
                  </button>
                </div>
              )}

              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>Total</span>
                <span>
                  ₹
                  {(
                    cartItems.reduce(
                      (total, item) => total + item.price * item.quantity,
                      0
                    ) - discount
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 text-green-800 border-gray-300 rounded focus:ring-green-800"
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{" "}
                  <Link
                    href="/terms-and-conditions"
                    target="_blank"
                    className="text-green-800 hover:text-green-900 underline"
                  >
                    Terms & Conditions
                  </Link>
                </label>
              </div>

              <button
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 
                  ${
                    !selectedAddress || !acceptedTerms
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#d4af37] hover:bg-[#014421]"
                  }`}
                onClick={handlePlaceOrder}
                disabled={!selectedAddress || !acceptedTerms}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
