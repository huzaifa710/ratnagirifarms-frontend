"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/app/cart-context/page";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";
import styles from "./page.module.css";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import Link from "next/link";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [pincodeStatus, setPincodeStatus] = useState({
    isValid: false,
    message: "",
    city: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' or 'cod'
  const [handlingCharge, setHandlingCharge] = useState(0);
  const [deliveryEstimate, setDeliveryEstimate] = useState("");

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

  useEffect(() => {
    setHandlingCharge(paymentMethod === "cod" ? 49 : 0);
  }, [paymentMethod]);

  useEffect(() => {
    if (selectedAddress) {
      checkDeliveryEstimate(selectedAddress.pincode);
    }
  }, [selectedAddress?.id]);

  useEffect(() => {
    // Handle address selection from address page
    const addressId = searchParams.get("addressId");
    if (addressId && addresses.length > 0) {
      const selectedAddr = addresses.find(
        (addr) => addr.id === parseInt(addressId)
      );
      if (selectedAddr) {
        setSelectedAddress(selectedAddr);
        checkDeliveryEstimate(selectedAddr.pincode);
      }
    }
  }, [addresses, searchParams]);

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
        // Auto-fill city if pincode is valid
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

  const checkDeliveryEstimate = async (pincode) => {
    try {
      const response = await api.post("/delhivery/check-pincode", {
        pincode: pincode,
      });

      if (response.data.success) {
        setDeliveryEstimate(response.data.message);
      } else {
        setDeliveryEstimate("");
      }
    } catch (error) {
      console.error("Error checking delivery estimate:", error);
      setDeliveryEstimate("Pincode Not Serviceable"); // Fallback estimate
    }
  };

  const fetchAvailableCoupons = async () => {
    try {
      const response = await api.get(`/coupons/available/${uuid}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        setAvailableCoupons(response.data.coupons);
      } else {
        toast.error("Failed to load available coupons");
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
      toast.error("Failed to load available coupons");
    }
  };

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
  const handleApplyCoupon = async (code) => {
    const couponCodeToApply = couponCode || code;
    if (!couponCodeToApply || couponCodeToApply === "") {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const response = await api.post("/coupons/apply", {
        uuid,
        code: couponCodeToApply,
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
        toast.error(response.data.error || "Invalid coupon");
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
      fetchAddresses();
      setShowAddressForm(false);
      setEditingAddress(null);
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
      mobile_number: address.mobile_number,
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

    if (!acceptedTerms) {
      toast.error("Please accept the Terms & Conditions to proceed");
      return;
    }

    try {
      // Create guest order or regular order based on checkout type
      const createOrderPayload = {
        uuid,
        cart_ids: cartItems.map((item) => item.id),
        user_address_id: selectedAddress.id,
        coupon_id: appliedCoupon ? appliedCoupon.id : null,
        payment_method: paymentMethod, // 'online' or 'cod'
        handling_charge: paymentMethod === "cod" ? 49 : 0,
      };
      const createOrderResponse = await api.post("orders/create", createOrderPayload);

      if (paymentMethod === "cod") {
        if (createOrderResponse.data.success) {
          toast.success("Order placed successfully!");
          router.push("/orders");
        } else {
          toast.error(createOrderResponse.data.message || "Failed to place COD order");
        }
        return;
      }

      // Online payment flow (Razorpay)
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
          contact: selectedAddress.mobile_number,
        },
        handler: async (response) => {
          try {
            const verifyResponse = await api.post("/orders/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              uuid,
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

  const handleChangeAddress = () => {
    const currentAddressId = selectedAddress?.id || "";
    router.push(`/checkout/select-address?current=${currentAddressId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.checkoutContainer}>
      <Toaster position="top-center" />

      {/* Header */}
      <div className="relative flex items-center justify-center mb-6 bg-white p-4 rounded-xl shadow-md min-h-[56px]">
        <button
          onClick={() => router.push("/cart")}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-12 h-12 text-2xl text-gray-800 rounded-xl hover:bg-gray-100 transition"
          aria-label="Back"
        >
          ←
        </button>
        <h1 className="text-2xl font-semibold text-gray-800 m-0 p-0 text-center leading-[1.2] flex items-center justify-center h-12">
          Checkout
        </h1>
      </div>

      {/* Delivery Address Section */}
      {selectedAddress ? (
        <div className={styles.deliveryAddressSection}>
          <h2 className={styles.sectionTitle}>Delivery Address</h2>
          <div className={styles.selectedAddressCard}>
            <div className={styles.addressDetails}>
              <h3 className={styles.addressName}>
                {selectedAddress.full_name}
              </h3>
              <p className={styles.addressText}>
                {selectedAddress.address}, {selectedAddress.city},{" "}
                {selectedAddress.state} - {selectedAddress.pincode}
              </p>
              <p className={styles.addressEmail}>{selectedAddress.email}</p>
              <p className={styles.addressPhone}>
                {selectedAddress.mobile_number}
              </p>
            </div>
            <button
              onClick={handleChangeAddress}
              className={styles.changeButton}
            >
              Change
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.addressSection}>
          <div className={styles.addressHeader}>
            <h2 className={styles.Message}>
              Please add new address to proceed with the order
            </h2>
            <button
              onClick={() => router.push("/checkout/select-address")}
              className={styles.addAddressBtn}
            >
              Add New Address
            </button>
          </div>
        </div>
      )}

      {/* Remove the existing address form and address list JSX since it's now in the separate page */}

      {/* Estimated Delivery Section */}
      {selectedAddress && deliveryEstimate && (
        <div className={styles.deliveryEstimateSection}>
          <h2 className={styles.sectionTitle}>Estimated Delivery</h2>
          <div className={styles.deliveryEstimateCard}>
            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryIcon}>📦</div>
              <div className={styles.deliveryDetails}>
                <p className={styles.deliveryText}>
                  Your order will be delivered in{" "}
                  <span className={styles.deliveryDays}>
                    {deliveryEstimate}
                  </span>
                </p>
                <p className={styles.deliveryLocation}>
                  to {selectedAddress.city}, {selectedAddress.state} -{" "}
                  {selectedAddress.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary Section */}
      <div className={styles.orderSummarySection}>
        <h2 className={styles.sectionTitle}>Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item.product_variant_id} className={styles.productCard}>
            <div className={styles.productImage}>
              <img src={item.image_url} alt={item.name} />
            </div>
            <div className={styles.productDetails}>
              <h3 className={styles.productName}>{item.name}</h3>
              <p className={styles.productWeight}>
                No Of Pieces Per Box:{item.quantity_per_box}
              </p>
              <div className={styles.quantityControls}>
                <button
                  onClick={() => removeFromCart(item.product_variant_id, 1)}
                  disabled={item.quantity <= 1}
                  className={styles.quantityBtn}
                >
                  <FaMinus />
                </button>
                <span className={styles.quantity}>{item.quantity}</span>
                <button
                  onClick={() => handleAddToCart(item.product_variant_id)}
                  className={styles.quantityBtn}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
            <div className={styles.productPrice}>
              ₹{(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Coupon Section */}
      <div className={styles.couponSection}>
        <div className={styles.couponInputContainer}>
          <input
            type="text"
            placeholder="Enter Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className={styles.couponInput}
          />
          <button onClick={handleApplyCoupon} className={styles.applyButton}>
            Apply
          </button>
        </div>
        <button
          onClick={() => {
            fetchAvailableCoupons();
            setShowCouponsModal(true);
          }}
          className={styles.viewCouponsButton}
        >
          View Available Coupons
        </button>
      </div>

      {/* Payment Method Section */}
      <div className={styles.paymentMethodContainer}>
        <h2 className={styles.sectionTitle}>Payment Method</h2>
        <div className={styles.paymentOptionsCard}>
          <div className={styles.paymentOptionWrapper}>
            <label className={styles.paymentOptionLabel} htmlFor="online">
              <span className={styles.paymentOptionText}>
                Online (UPI/Card/Netbanking)
              </span>
              <input
                type="radio"
                id="online"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
                className={styles.radioInput}
              />
            </label>
          </div>
          <div className={styles.paymentOptionWrapper}>
            <label className={styles.paymentOptionLabel} htmlFor="cod">
              <span className={styles.paymentOptionText}>Cash on Delivery</span>
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className={styles.radioInput}
              />
            </label>
          </div>
        </div>

        <div className={styles.securePayments}>
          <div className={styles.securePaymentsHeader}>
            <span className={styles.secureIcon}>✓</span>
            <span className={styles.secureText}>100% Secure Payments</span>
          </div>
        </div>

        <div className={styles.paymentLogos}>
          <img
            alt="Visa Logo"
            className={styles.paymentLogo}
            src="/payment/visa-icon.png"
          />
          <img
            alt="Mastercard Logo"
            className={styles.paymentLogo}
            src="/payment/mastercard-icon.png"
          />
          <img
            alt="Gpay Logo"
            className={styles.paymentLogo}
            src="/payment/gpay-icon.png"
          />
          <img
            alt="UPI Logo"
            className={styles.paymentLogo}
            src="/payment/upi-icon.png"
          />
        </div>
      </div>

      {/* Bill Details Section */}
      <div className={styles.billDetailsSection}>
        <h2 className={styles.sectionTitle}>Bill Details</h2>
        <div className={styles.billRow}>
          <span>Subtotal</span>
          <span>
            ₹
            {cartItems
              .reduce((total, item) => total + item.price * item.quantity, 0)
              .toFixed(2)}
          </span>
        </div>
        <div className={styles.billRow}>
          <span>Delivery Charges</span>
          <span className={styles.freeDelivery}>FREE</span>
        </div>
        {paymentMethod === "cod" && (
          <div className={styles.billRow}>
            <span>Handling Charge (COD)</span>
            <span>₹{handlingCharge.toFixed(2)}</span>
          </div>
        )}
        {appliedCoupon && (
          <div className={styles.billRow}>
            <span>Coupon ({appliedCoupon.code})</span>
            <span>- ₹{discount.toFixed(2)}</span>
            <button
              onClick={handleRemoveCoupon}
              className={styles.removeCouponBtn}
            >
              Remove
            </button>
          </div>
        )}
        <div className={styles.totalRow}>
          <span>Total</span>
          <span>
            ₹
            {(
              cartItems.reduce(
                (total, item) => total + item.price * item.quantity,
                0
              ) -
              discount +
              handlingCharge
            ).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Terms and Place Order */}
      <div className={styles.checkoutFooter}>
        <label className={styles.termsCheckbox}>
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
          />
          <span>
            I agree to the{" "}
            <Link
              href="/terms-and-conditions"
              target="_blank"
              className={styles.termsLink}
            >
              Terms & Conditions
            </Link>
          </span>
        </label>

        <button
          className={styles.placeOrderButton}
          onClick={handlePlaceOrder}
          disabled={!selectedAddress || !acceptedTerms}
        >
          Place Order →
        </button>
      </div>

      {/* Coupons Modal */}
      {showCouponsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Available Coupons</h3>
              <button
                onClick={() => setShowCouponsModal(false)}
                className={styles.closeButton}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            <div className={styles.modalBody}>
              {availableCoupons.length > 0 ? (
                <div className={styles.couponsList}>
                  {availableCoupons.map((coupon) => (
                    <div key={coupon.id} className={styles.couponCard}>
                      <div className={styles.couponHeader}>
                        <div className={styles.couponCode}>{coupon.code}</div>
                        <div className={styles.discountValue}>
                          {coupon.discount_type === "percentage"
                            ? `${coupon.discount_value}% OFF`
                            : `₹${coupon.discount_value} OFF`}
                        </div>
                      </div>
                      <div className={styles.couponDetails}>
                        {coupon.min_order_value > 0 && (
                          <p>
                            Min. Order:{" "}
                            <span className={styles.highlight}>
                              ₹{coupon.min_order_value}
                            </span>
                          </p>
                        )}
                        {coupon.max_discount_value > 0 &&
                          coupon.discount_type === "percentage" && (
                            <p>
                              Max Discount:{" "}
                              <span className={styles.highlight}>
                                ₹{coupon.max_discount_value}
                              </span>
                            </p>
                          )}
                        <p>
                          <span className={styles.usageInfo}>
                            <span className={styles.remainingUses}>
                              {coupon.remaining_uses} uses left
                            </span>
                            {coupon.expiry_date && (
                              <span className={styles.expiryDate}>
                                Valid till:{" "}
                                {
                                  new Date(coupon.expiry_date)
                                    .toISOString()
                                    .split("T")[0]
                                }
                              </span>
                            )}
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setCouponCode(coupon.code);
                          setShowCouponsModal(false);
                          handleApplyCoupon(coupon.code);
                        }}
                        className={styles.applyCouponCardBtn}
                      >
                        Apply Coupon
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.noCoupons}>
                  <p>No coupons available</p>
                  <button
                    onClick={() => setShowCouponsModal(false)}
                    className={styles.backButton}
                  >
                    Back to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
