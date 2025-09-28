"use client";
import { useState, useEffect, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/app/cart-context/page";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";
import styles from "./page.module.css";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import React from "react";
import Link from "next/link";

function CheckoutContent() {
  // Success Modal State
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderSuccessDetails, setOrderSuccessDetails] = useState(null);

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
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const justRemovedCoupon = useRef(false);
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

  // Initialize checkout state depending on auth status.
  // If user not logged in, immediately show auth modal and expose guest cart without blocking overlay.
  useEffect(() => {
    if (!uuid && !accessToken) {
      setShowAuthModal(true);
      setCartItems(guestCart || []);
      setLoading(false); // Remove loading overlay so login widget is clickable
      return; // Stop further fetching
    }

    // Logged in: fetch required data
    if (uuid && accessToken) {
      fetchCartItems();
      fetchAddresses();
      fetchAvailableCoupons(); // Pre-load available coupons
    }
  }, [uuid, accessToken, guestCart]);

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

  useEffect(() => {
    // Handle coupon code from URL parameters
    const urlCouponCode = searchParams.get("coupon");
    if (
      urlCouponCode &&
      !appliedCoupon &&
      cartItems.length > 0 &&
      !justRemovedCoupon.current
    ) {
      setCouponCode(urlCouponCode);
      handleApplyCoupon(urlCouponCode, false); // Don't show toast when auto-applying from URL
    }
  }, [searchParams, cartItems, appliedCoupon]);

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
    setCouponsLoading(true);
    setAvailableCoupons([]); // Clear previous coupons
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
    } finally {
      setCouponsLoading(false);
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
  const handleApplyCoupon = async (code, showToast = true) => {
    // Prevent guests from attempting server coupon application
    if (!uuid && !accessToken) {
      if (showToast) toast.error("Please login to apply a coupon");
      setShowAuthModal(true);
      return;
    }
    const couponCodeToApply = couponCode || code;
    if (!couponCodeToApply || couponCodeToApply === "") {
      if (showToast) toast.error("Please enter a coupon code");
      return;
    }

    setCouponLoading(true);
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
        if (showToast) {
          toast.success(`Coupon applied! You saved ₹${response.data.discount}`);
        }

        // Add coupon code to URL parameters
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set("coupon", couponCodeToApply);
        router.replace(`/checkout?${newSearchParams.toString()}`, {
          scroll: false,
        });
      } else {
        if (showToast) toast.error(response.data.error || "Invalid coupon");
      }
    } catch (error) {
      console.error("Coupon application error:", error);
      if (showToast)
        toast.error(error.response?.data?.message || "Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  // Add this function to handle coupon removal
  const handleRemoveCoupon = () => {
    setCouponCode("");
    setDiscount(0);
    setAppliedCoupon(null);
    justRemovedCoupon.current = true; // Flag to prevent reapplication

    // Remove coupon parameter from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("coupon");
    const newUrl = newSearchParams.toString()
      ? `/checkout?${newSearchParams.toString()}`
      : "/checkout";
    router.replace(newUrl, { scroll: false });

    // Reset the flag after a short delay
    setTimeout(() => {
      justRemovedCoupon.current = false;
    }, 1000);

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
    let prevCart = [...cartItems];
    let updatedCart;
    if (!uuid || !accessToken) {
      const product = cartItems.find(
        (item) => item.product_variant_id === product_variant_id
      );
      if (product) {
        addToGuestCart(product);
        updatedCart = prevCart.map((item) =>
          item.product_variant_id === product_variant_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setCartItems(updatedCart);
        toast.success("Added to cart");
      }
      return;
    }
    // Optimistically update UI
    updatedCart = prevCart.map((item) =>
      item.product_variant_id === product_variant_id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    setCartItems(updatedCart);
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
      setCartItems(prevCart); // Rollback
      toast.error("Failed to add to cart. Retry?");
    }
  };

  const removeFromCart = async (product_variant_id, quantity) => {
    let prevCart = [...cartItems];
    let updatedCart;
    if (!uuid && !accessToken) {
      removeFromGuestCart(product_variant_id, quantity);
      updatedCart = prevCart
        .map((item) =>
          item.product_variant_id === product_variant_id
            ? { ...item, quantity: item.quantity - quantity }
            : item
        )
        .filter((item) => item.quantity > 0);
      setCartItems(updatedCart);
      toast.success("Item removed from cart");
      return;
    }
    // Optimistically update UI
    updatedCart = prevCart
      .map((item) =>
        item.product_variant_id === product_variant_id
          ? { ...item, quantity: item.quantity - quantity }
          : item
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updatedCart);
    try {
      const payload = { uuid, product_variant_id, quantity };
      await api.post(`/carts/remove`, payload);
      toast.success("Item removed from cart");
      await fetchCartItems();
      await updateCartCount();
    } catch (error) {
      setCartItems(prevCart); // Rollback
      toast.error("Failed to remove item. Retry?");
    }
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

    setOrderLoading(true);
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
      const createOrderResponse = await api.post(
        "orders/create",
        createOrderPayload
      );

      if (paymentMethod === "cod") {
        if (createOrderResponse.data.success) {
          setOrderSuccessDetails({
            id: createOrderResponse.data.order_id,
          });
          setShowOrderSuccess(true);
        } else {
          toast.error(
            createOrderResponse.data.message || "Failed to place COD order"
          );
        }
        setOrderLoading(false);
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
              setOrderSuccessDetails({
                id: verifyResponse.data.order_id,
              });
              setShowOrderSuccess(true);
            } else {
              toast.error("Payment verification failed");
            }
          } catch (error) {
            toast.error("Payment verification failed");
          } finally {
            setOrderLoading(false);
          }
        },
        theme: {
          color: "#e5c07b",
        },
        modal: {
          ondismiss: () => {
            setOrderLoading(false);
          },
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
      setOrderLoading(false);
      toast.error("Failed to create order");
      console.error(error);
    }
  };

  const handleChangeAddress = () => {
    const currentAddressId = selectedAddress?.id || "";
    const couponParam = searchParams.get("coupon");
    let url = `/checkout/select-address?current=${currentAddressId}`;
    if (couponParam) {
      url += `&coupon=${couponParam}`;
    }
    router.push(url);
  };

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className={styles.loadingOverlayContent}>
          <div className={styles.spinner}></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show a focused login required screen (guest flow already triggered auth modal)
  if (!uuid && !accessToken) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-800">Login Required</h1>
        <p className="text-gray-600 max-w-md">
          Please login or create an account to continue with checkout. Your cart
          items are saved.
        </p>
        <button
          onClick={() => setShowAuthModal(true)}
          className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium shadow transition"
        >
          Open Login
        </button>
        <button
          onClick={() => router.push("/cart")}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <Toaster position="top-center" />
      {orderLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingOverlayContent}>
            <div className={styles.spinner}></div>
            <p>Placing your order...</p>
          </div>
        </div>
      )}

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
              onClick={() => {
                const couponParam = searchParams.get("coupon");
                let url = "/checkout/select-address";
                if (couponParam) {
                  url += `?coupon=${couponParam}`;
                }
                router.push(url);
              }}
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
          <CartItem
            key={item.product_variant_id}
            item={item}
            onAdd={handleAddToCart}
            onRemove={removeFromCart}
          />
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
            disabled={appliedCoupon !== null}
          />
          {appliedCoupon ? (
            <button
              onClick={handleRemoveCoupon}
              className={styles.removeButton}
            >
              Remove
            </button>
          ) : (
            <button
              onClick={handleApplyCoupon}
              className={styles.applyButton}
              disabled={couponLoading}
            >
              {couponLoading ? (
                <>
                  <div className={styles.buttonSpinner}></div>
                  Applying...
                </>
              ) : (
                "Apply"
              )}
            </button>
          )}
        </div>
        <button
          onClick={() => {
            setShowCouponsModal(true);
            // Coupons are already pre-loaded, but refresh if empty or show loading if still loading
            if (availableCoupons.length === 0 && !couponsLoading) {
              fetchAvailableCoupons();
            }
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
          disabled={!selectedAddress || !acceptedTerms || orderLoading}
        >
          {orderLoading ? (
            <>
              <div className={styles.buttonSpinner}></div>
              Placing your order...
            </>
          ) : (
            <>Place Order →</>
          )}
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
              {couponsLoading ? (
                <div className={styles.loadingCoupons}>
                  <div className={styles.spinner}></div>
                  <p>Loading available coupons...</p>
                </div>
              ) : availableCoupons.length > 0 ? (
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

      {/* Order Success Modal */}
      {showOrderSuccess && (
        <div className={styles.modalOverlay}>
          <div className={styles.successModal}>
            <div className={styles.successHeader}>
              <div className={styles.successIconContainer}>
                <span className={styles.successIcon}>🎉</span>
              </div>
              <h2>Order Placed Successfully!</h2>
              <p className={styles.successSubtitle}>
                Thank you for your purchase. Your order has been placed and is
                being processed.
              </p>
            </div>
            <div className={styles.successBody}>
              {orderSuccessDetails && (
                <div className={styles.orderDetailsBox}>
                  <div className={styles.orderDetailRow}>
                    <span className={styles.orderDetailLabel}>
                      <strong>Order ID:</strong>
                    </span>
                    <span className={styles.orderDetailValue}>
                      {orderSuccessDetails.id}
                    </span>
                  </div>
                  <div className={styles.orderDetailRow}>
                    <span className={styles.orderDetailLabel}>
                      <strong>Delivery to:</strong>
                    </span>
                    <span className={styles.orderDetailValue}>
                      {selectedAddress.full_name}
                      <br />
                      {selectedAddress.address}, {selectedAddress.city},{" "}
                      {selectedAddress.state} - {selectedAddress.pincode}
                    </span>
                  </div>
                  <div className={styles.orderDetailRow}>
                    <span className={styles.orderDetailLabel}></span>
                    <span className={styles.orderDetailValue}>
                      <strong>{deliveryEstimate || "2-3 business days"}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className={styles.successFooter}>
              <button
                className={styles.primaryBtn}
                onClick={() => {
                  setShowOrderSuccess(false);
                  router.push("/orders");
                }}
              >
                Go to My Orders
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={() => {
                  setShowOrderSuccess(false);
                  router.push("/");
                }}
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Memoized cart item component
const CartItem = React.memo(function CartItem({ item, onAdd, onRemove }) {
  return (
    <div className={styles.productCard}>
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
            onClick={() => onRemove(item.product_variant_id, 1)}
            disabled={item.quantity <= 1}
            className={styles.quantityBtn}
          >
            <FaMinus />
          </button>
          <span className={styles.quantity}>{item.quantity}</span>
          <button
            onClick={() => onAdd(item.product_variant_id)}
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
  );
});

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
