"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/auth-context/page";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";
import styles from "./page.module.css";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaSearch,
  FaSort
} from "react-icons/fa";
import Link from "next/link";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const { accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push("/admin/login");
      return;
    }
    fetchProducts();
  }, [accessToken, sortField, sortDirection]);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/all?admin=true ", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      let sortedProducts = [...response.data.products];
      
      // Sort products
      sortedProducts.sort((a, b) => {
        if (sortField === "name") {
          return sortDirection === "asc" 
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
        return 0;
      });

      setProducts(sortedProducts);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch products");
      setLoading(false);
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      await api.put(`/products/toggle-status/${productId}`, 
        { is_active: !currentStatus },
        { headers: { Authorization: `Bearer ${accessToken}` }}
      );
      toast.success("Product status updated");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to update product status");
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await api.delete(`/products/delete/${productId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-center" />
      
      <div className={styles.header}>
        <h1>Product Management</h1>
        <Link href="/admin/noob/products/new" className={styles.addButton}>
          <FaPlus /> Add New Product
        </Link>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FaSearch />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading products...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => handleSort("name")} className={styles.sortable}>
                  Name {sortField === "name" && <FaSort />}
                </th>
                <th>Variants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    <div className={styles.variants}>
                      {product.product_variants.filter(v => v.is_active).map((variant) => (
                        <span key={variant.id} className={styles.variant}>
                          {variant.quantity_per_box} pcs - ₹{variant.price}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <button
                      className={`${styles.statusButton} ${
                        product.is_active ? styles.active : styles.inactive
                      }`}
                      onClick={() => toggleProductStatus(product.id, product.is_active)}
                    >
                      {product.is_active ? <FaCheck /> : <FaTimes />}
                      {product.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/products/${product.id}`}
                        className={styles.editButton}
                        title="View product"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/noob/products/edit/${product.id}`}
                        className={styles.editButton}
                      >
                        <FaEdit />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}