"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  FaShoppingCart,
  FaMinus,
  FaPlus,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BiSolidBellRing } from "react-icons/bi";
import { useCart } from "@/app/cart-context/page";
import { useAuth } from "@/app/auth-context/page";
import { toast } from "react-hot-toast";
import api from "@/utils/axios";
import NotifyModal from "@/app/notify-modal/page";
import styles from "./page.module.css";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const { updateCartCount, addToGuestCart } = useCart();
  const { uuid, accessToken } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data.product);
      if (response.data.product.product_variants.length > 0) {
        setSelectedVariant(response.data.product.product_variants[0]);
      }
    } catch (error) {
      toast.error("Failed to fetch product details");
    } finally {
      setLoading(false);
    }
  };

  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    if (!uuid || !accessToken) {
      addToGuestCart({
        product_variant_id: selectedVariant.id,
        quantity: quantity,
      });
      toast.success("Added to cart");
      return;
    }

    try {
      await api.post(`/carts/add`, {
        uuid,
        product_variant_id: selectedVariant.id,
        quantity: quantity,
      });
      toast.success("Added to cart");
      updateCartCount();
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!product) {
    return <div className={styles.error}>Product not found</div>;
  }

  let productImages = [];

  if (product.name.toLowerCase().includes("pulp")) {
    productImages = [
      "/pulp/mangopulp2.jpg",
      "/pulp/pulp.jpg",
      "/pulp/mango pulp3.jpg",
      "/pulp/mango pulp.jpg",
      "/pulp/mango-pulp.jpg",
    ];
  } else {
    productImages = ["/card/image3.png"];
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  return (
    <div className={styles.singleProductPage}>
      {/* Carousel */}
      <div className={styles.carouselSection}>
        <button className={styles.carouselArrow} onClick={prevImage}>
          <span className="material-icons">chevron_left</span>
        </button>
        <img
          src={productImages[currentImageIndex]}
          alt={product.name}
          className={styles.mainProductImage}
        />
        <button className={styles.carouselArrow} onClick={nextImage}>
          <span className="material-icons">chevron_right</span>
        </button>
      </div>

      {/* Product Info */}
      <div className={styles.infoSection}>
        <h1 className={styles.productTitle}>{product.name}</h1>
        <div className={styles.productSubtitle}>
          {product.subtitle || "King (250-300g)"}
        </div>
        <div className={styles.variantSelector}>
          <span className={styles.variantLabel}>Select Variant</span>
          <div className={styles.variantOptions}>
            {product.product_variants.map((variant) => (
              <button
                key={variant.id}
                className={
                  selectedVariant?.id === variant.id
                    ? styles.variantSelected
                    : styles.variantOption
                }
                onClick={() => handleVariantChange(variant)}
              >
                {variant.quantity_per_box} pieces
              </button>
            ))}
          </div>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>₹{selectedVariant?.price}</span>
          {selectedVariant?.original_price && (
            <span className={styles.originalPrice}>
              ₹{selectedVariant.original_price}
            </span>
          )}
        </div>
        <button className={styles.addToCartButton} onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
      <div className={styles.descriptionHeader}>
        <h3>Product Description</h3>
      </div>
      <div className={styles.description}>
        {product.description ? (
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        ) : (
          <p>
            Experience the authentic taste of Ratnagiri Alphonso mangoes,
            carefully handpicked and delivered fresh to your doorstep.
          </p>
        )}
      </div>

      {/* Feature Icons */}
      <div className={styles.featuresRow}>
        <div className={styles.featureItem}>
          <span className="material-icons text-green-600">spa</span>
        </div>
        <div className={styles.featureItem}>
          <span className="material-icons text-green-600">air</span>
        </div>
        <div className={styles.featureItem}>
          <span className="material-icons text-green-600">eco</span>
        </div>
        <div className={styles.featureItem}>
          <span className="material-icons text-green-600">local_shipping</span>
        </div>
      </div>

      {/* Notify Modal */}
      {showNotifyModal && (
        <NotifyModal
          productName={product.name}
          variantId={selectedVariant?.id}
          onClose={() => setShowNotifyModal(false)}
        />
      )}
    </div>
  );
}
