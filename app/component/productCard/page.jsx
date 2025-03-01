// "use client";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { environment } from "@/environment";
// import styles from "./page.module.css";

// const getAllProducts = async () => {
//   const response = await axios.get(`${environment.API_URL}/products/all`);
//   return response.data.products;
// };

// function SingleProduct({ product }) {
//   // Initialize with the price from the first variant, or 0 if not available
//   const [price, setPrice] = useState(
//     product.product_variants.length > 0 ? product.product_variants[0].price : 0
//   );

//   const handleVariantClick = (variant) => {
//     setPrice(variant.price);
//   };

//   console.log(product);

//   return (
//     <div className={styles.card} key={product.id}>
//       <img src="/card/image1.png" alt="Denim Jeans" />
//       <h1>{product.name}</h1>
//       <p className={styles.price}>Price: INR {price}</p>
//       <p>No of pieces per box :</p>
//       <div className="flex gap-4 justify-center">
//         {product.product_variants.map((variant) => (
//             <div key={variant.id} >
//             <p onClick={() => handleVariantClick(variant)} className="border border-gray-300 p-2 cursor-pointer">
//                 {variant.quantity_per_box}
//             </p>
//             </div>
//         ))}
//       </div>

//       <p>
//         <button>Add to Cart</button>
//       </p>
//     </div>
//   );
// }

// export default function ProductCard() {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const productsData = await getAllProducts();
//       setProducts(productsData);
//     };
//     fetchProducts();
//   }, []);

//   return (
//     <div className="flex md:flex-row flex-col justify-center gap-8 p-4 max-w-screen-2xl mx-auto bg-white">
//       {products.map((product) => (
//         <SingleProduct key={product.id} product={product} />
//       ))}
//     </div>
//   );
// }

"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import { environment } from "@/environment";
import styles from "./page.module.css";
import { FaShoppingCart } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast"; // Import toast

const getAllProducts = async () => {
  const response = await axios.get(`${environment.API_URL}/products/all`);
  return response.data.products;
};

const handleAddToCart = async (variant) => {
  try {
    await axios.post(`${environment.API_URL}/carts/add`, {
      uuid: "d0e66e4c-0195-4375-a327-676a38f62e88",
      product_variant_id: variant.id,
      quantity: 1,
    });
    toast.success("Added to cart");
  } catch (error) {
    toast.error("Failed to add to cart");
    console.error(error);
  }
};

function SingleProduct({ product }) {
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
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          className: styles.toast,
          success: {
            className: styles.successToast,
          },
          error: {
            className: styles.errorToast,
          },
        }}
      />
      <div className={styles.card}>
        <img
          src="/card/image1.png"
          alt={product.name}
          className={styles.productImage}
        />
        <h2 className={styles.title}>{product.name}</h2>
        <p className={styles.price}>₹{selectedVariant?.price}</p>
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
