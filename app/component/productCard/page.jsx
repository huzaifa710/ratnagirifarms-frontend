"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast"; // Import toast
import { useCart } from "@/app/cart-context/page";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";

const getAllProducts = async () => {
  const response = await api.get(`/products/all`);
  return response.data.products;
};

function SingleProduct({ product }) {
  const { updateCartCount, addToGuestCart } = useCart();
  const { uuid, accessToken } = useAuth();

  const handleAddToCart = async (variant) => {
    if (!uuid || !accessToken) {
      // Handle guest cart
      addToGuestCart({
        product_variant_id: variant.id,
        name: product.name,
        price: variant.price,
        quantity_per_box: variant.quantity_per_box,
        is_active: variant.is_active,
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
  // Sort variants when initializing the component
  const sortedVariants = [...product.product_variants].sort(
    (a, b) => a.quantity_per_box - b.quantity_per_box
  );

  const [selectedVariant, setSelectedVariant] = useState(
    sortedVariants.length > 0 ? sortedVariants[0] : null
  );

  const handleVariantClick = (variant) => {
    setSelectedVariant(variant);
  };

  return (
    <>
      <div className={styles.card}>
        <img
          src="/card/image2.png"
          alt={product.name}
          className={styles.productImage}
        />
        
        <div className={styles.productContentTop}>
          <h2 className={styles.title}>{product.name}</h2>
          <p className={styles.price}>{selectedVariant?.price}</p>
        </div>
        
        <div className={styles.productContentBottom}>
          <p className={styles.piecesLabel}>No Of Pieces Per Box :</p>
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
            <button className={styles.outOfStock}>
              <FaShoppingCart />
              Out Of Stock
            </button>
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
    <div className={styles.container}>
      {products.map((product) => (
        <SingleProduct key={product.id} product={product} />
      ))}
    </div>
  );
}
