"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { toast } from "react-hot-toast"; // Import toast
import { useCart } from "@/app/cart-context/page";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import NotifyModal from "@/app/notify-modal/page";
import { BiSolidBellRing } from "react-icons/bi";
import Cookies from "js-cookie";
import AvailableCoupons from "@/app/component/availableCoupons/page";

const getAllProducts = async () => {
  const response = await api.get(`/products/all`);
  return response.data.products;
};

// Cookie helper functions
const NOTIFY_EMAIL_COOKIE = "notify_email";
const NOTIFIED_VARIANTS_COOKIE = "notified_variants";

const getNotifyEmail = () => {
  return Cookies.get(NOTIFY_EMAIL_COOKIE) || null;
};

const setNotifyEmail = (email) => {
  Cookies.set(NOTIFY_EMAIL_COOKIE, email, { expires: 30 }); // 30 days expiry
};

const getNotifiedVariants = () => {
  const notified = Cookies.get(NOTIFIED_VARIANTS_COOKIE);
  if (!notified) return [];
  try {
    return JSON.parse(notified);
  } catch (error) {
    console.error("Error parsing notified variants cookie:", error);
    return [];
  }
};

const addNotifiedVariant = (variantId) => {
  const notified = getNotifiedVariants();
  if (!notified.includes(variantId)) {
    notified.push(variantId);
    Cookies.set(NOTIFIED_VARIANTS_COOKIE, JSON.stringify(notified), {
      expires: 30,
    }); // 30 days expiry
  }
  return notified;
};

function SingleProduct({ product }) {
  const { updateCartCount, addToGuestCart } = useCart();
  const { uuid, accessToken } = useAuth();
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifiedVariants, setNotifiedVariants] = useState([]);

  // Sort variants when initializing the component
  const sortedVariants = [...product.product_variants].sort(
    (a, b) => a.quantity_per_box - b.quantity_per_box
  );

  const [selectedVariant, setSelectedVariant] = useState(
    sortedVariants.length > 0 ? sortedVariants[0] : null
  );

  // Initialize notified variants from cookie when component mounts
  useEffect(() => {
    setNotifiedVariants(getNotifiedVariants());
  }, []);

  const handleAddToCart = async (variant) => {
    // Existing cart logic
    if (!uuid || !accessToken) {
      // Handle guest cart
      addToGuestCart({
        product_variant_id: variant.id,
      });
      toast.success("Added to cart");
      return;
    }

    // Handle authenticated cart
    try {
      await api.post(`/carts/add`, {
        uuid,
        product_variant_id: variant.id,
        quantity: 1,
      });
      toast.success("Added to cart");
      await updateCartCount(); // Update cart count after successful addition
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    }
  };

  const handleNotifyClick = () => {
    // Check if we already have notify_email in cookie
    const notifyEmail = getNotifyEmail();

    if (notifyEmail && selectedVariant) {
      // Directly send notification request without showing modal
      sendNotifyRequest(notifyEmail, selectedVariant.id);
    } else {
      // Show the modal to collect email
      setShowNotifyModal(true);
    }
  };

  const sendNotifyRequest = async (email, variantId) => {
    try {
      await api.post("/notify/create", {
        email,
        product_variant_id: variantId,
      });

      // Add this variant to the notified list and update cookie
      const updatedNotified = addNotifiedVariant(variantId);
      setNotifiedVariants(updatedNotified);

      // Store the email in cookie for future notifications
      setNotifyEmail(email);

      toast.success("We'll notify you when this product is back in stock!");
    } catch (error) {
      toast.error("Failed to set notification. Please try again.");
      console.error(error);
    }
  };

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
  };

  const handleModalClose = (notified = false, email = null) => {
    setShowNotifyModal(false);

    if (notified && selectedVariant && email) {
      // If notification was set up, add the variant to notified list
      const updatedNotified = addNotifiedVariant(selectedVariant.id);
      setNotifiedVariants(updatedNotified);

      // Store the email in cookie for future notifications
      setNotifyEmail(email);
    }
  };

  const isVariantNotified =
    selectedVariant && notifiedVariants.includes(selectedVariant.id);
    
  let imageScr = "/card/image3.png"

  if(product.name === "Ratnagiri Alphonso Mango Pulp 850 Grams") {
    imageScr = "/card/mango-pulp.jpg" // replace with your new image path
  } else if(product.name === "Ratnagiri Premium Sun-Dried Mango Slices 1KG") {
    imageScr = "/card/dry-mango.jpg"
  }

  return (
    <>
      <div className={styles.card}>
        <img
          src={imageScr}
          alt={product.name}
          className={styles.productImage}
        />

        <div className={styles.productContentTop}>
          <h2 className={styles.title}>{product.name}</h2>
          <p className={`${styles.originalPrice} text-gray-500`}>
            <del>{selectedVariant?.original_price}</del>
          </p>{" "}
          <p className={styles.price}>{selectedVariant?.price}</p>
        </div>

        <div className={styles.productContentBottom}>
          <p className={styles.piecesLabel}>No Of Pieces Per Box: </p>
          <div className={styles.variantContainer}>
            {sortedVariants.map((variant) => (
              <button
                key={variant.id}
                className={
                  selectedVariant?.id === variant.id
                    ? styles.variantSelected
                    : styles.variantButton
                }
                onClick={() => handleVariantClick(variant)}
              >
                {variant.quantity_per_box}
              </button>
            ))}
          </div>
          {selectedVariant?.is_active ? (
            <button
              className={styles.addToCart}
              onClick={() => handleAddToCart(selectedVariant)}
            >
              <FaShoppingCart /> Add To Cart
            </button>
          ) : (
            <div className={styles.outOfStockActions}>
              <button
                className={styles.outOfStock}
                onClick={handleNotifyClick}
                disabled={isVariantNotified}
              >
                <span>
                  {isVariantNotified ? "Notified" : "Notify When Available"}
                </span>
                {!isVariantNotified && <BiSolidBellRing />}
              </button>

              {showNotifyModal && (
                <NotifyModal
                  productName={product.name}
                  variantId={selectedVariant.id}
                  onClose={handleModalClose}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ProductCard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await getAllProducts();
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  return (
    <div className={styles.pageContainer}>
      {/* Buy More, Save More Section */}
      <section
        className={`${styles.couponsSection} ${styles.section} ${styles.fadeIn}`}
      >
        <h2 className={styles.sectionTitle}>Special Offers</h2>
        <AvailableCoupons />
      </section>
      <div className={styles.savingsPrompt}>
        <h3 className={styles.savingsHeading}>Buy More, Save More!</h3>
        <p className={styles.savingsSubtext}>
          Enjoy exclusive discounts when you buy larger packs.
        </p>
        <div className={styles.savingsCardsWrapper}>
          <div className={styles.savingsCard}>
            <h4>Small Mango</h4>
            <ul>
              <li>1 Dozen – ₹799</li>
              <li>
                2 Dozen – ₹1399{" "}
                <span className={styles.saveHighlight}>(Save ₹199)</span>
              </li>
              <li>
                4 Dozen – ₹2599{" "}
                <span className={styles.saveHighlight}>(Save ₹597)</span>
              </li>
            </ul>
          </div>
          <div className={styles.savingsCard}>
            <h4>Regular Mango</h4>
            <ul>
              <li>1 Dozen – ₹999</li>
              <li>
                2 Dozen – ₹1799{" "}
                <span className={styles.saveHighlight}>(Save ₹199)</span>
              </li>
              <li>
                4 Dozen – ₹3399{" "}
                <span className={styles.saveHighlight}>(Save ₹597)</span>
              </li>
            </ul>
          </div>
          <div className={styles.savingsCard}>
            <h4>Queen Mango</h4>
            <ul>
              <li>1 Dozen – ₹1199</li>
              <li>
                2 Dozen – ₹2199{" "}
                <span className={styles.saveHighlight}>(Save ₹199)</span>
              </li>
              <li>
                4 Dozen – ₹4199{" "}
                <span className={styles.saveHighlight}>(Save ₹597)</span>
              </li>
            </ul>
          </div>
          <div className={styles.savingsCard}>
            <h4>King Mango</h4>
            <ul>
              <li>1 Dozen – ₹1499</li>
              <li>
                2 Dozen – ₹2799{" "}
                <span className={styles.saveHighlight}>(Save ₹199)</span>
              </li>
              <li>
                4 Dozen – ₹5399{" "}
                <span className={styles.saveHighlight}>(Save ₹597)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.container}>
        {products.map((product) => (
          <SingleProduct key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
