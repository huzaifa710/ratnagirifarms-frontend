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
    <div className={styles.container}>
      <div className={styles.productGrid}>
        <div className={styles.imageSection}>
          <div className={styles.carouselContainer}>
            <button
              className={`${styles.carouselButton} ${styles.prevButton}`}
              onClick={prevImage}
            >
              <FaChevronLeft />
            </button>
            <img
              src={productImages[currentImageIndex]}
              alt={product.name}
              className={styles.productImage}
            />
            <button
              className={`${styles.carouselButton} ${styles.nextButton}`}
              onClick={nextImage}
            >
              <FaChevronRight />
            </button>
          </div>
          <div className={styles.thumbnailContainer}>
            {productImages.map((img, index) => (
              <div
                key={index}
                className={`${styles.thumbnail} ${
                  currentImageIndex === index ? styles.activeThumbnail : ""
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.detailsSection}>
          <h1 className={styles.productTitle}>{product.name}</h1>

          <div className={styles.variantsContainer}>
            <h3 className={styles.variantsTitle}>Select Variant</h3>
            <div className={styles.variantButtons}>
              {product.product_variants.map((variant) => (
                <button
                  key={variant.id}
                  className={
                    selectedVariant?.id === variant.id
                      ? styles.variantSelected
                      : styles.variantButton
                  }
                  onClick={() => handleVariantChange(variant)}
                >
                  {variant.quantity_per_box} pieces
                </button>
              ))}
            </div>
          </div>

          <div className={styles.priceSection}>
            {selectedVariant?.original_price && (
              <span className={styles.originalPrice}>
                {selectedVariant.original_price}
              </span>
            )}
            <span className={styles.price}>{selectedVariant?.price}</span>
          </div>

          <div className={styles.addToCartSection}>
            {selectedVariant?.is_active ? (
              <>
                {/* <div className={styles.quantityControl}>
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)}>
                    <FaPlus />
                  </button>
                </div> */}
                <button
                  className={styles.addToCartButton}
                  onClick={handleAddToCart}
                >
                  <FaShoppingCart /> Add to Cart
                </button>
              </>
            ) : (
              <button
                className={styles.notifyButton}
                onClick={() => setShowNotifyModal(true)}
              >
                <BiSolidBellRing /> Notify When Available
              </button>
            )}
          </div>
          <div className={styles.descriptionHeader}>
            <h3>Product Description</h3>
          </div>
          <div className={styles.description}>
            {product.description ? (
              <div
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p>
                Experience the authentic taste of Ratnagiri Alphonso mangoes, carefully handpicked and delivered fresh to your doorstep.
              </p>
            )}
          </div>
        </div>
      </div>

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
