"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";

export default function EditProduct({ params }) {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    image_url: "",
    product_variants: [],
  });
  const productId = params.id;

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      if (response.data.success) {
        setProduct(response.data.product);
      } else {
        toast.error("Failed to fetch product");
      }
    } catch (error) {
      toast.error("Error loading product");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setProduct((prev) => {
      const updatedVariants = [...prev.product_variants];
      updatedVariants[index] = { ...updatedVariants[index], [field]: value };
      return { ...prev, product_variants: updatedVariants };
    });
  };

  const setVariantActive = (index, isActive) => {
    setProduct((prev) => {
      const updated = [...prev.product_variants];
      updated[index] = { ...updated[index], is_active: isActive };
      return { ...prev, product_variants: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      toast.error("You are not authorized");
      return;
    }
    try {
      const payload = {
        name: product.name,
        description: product.description,
        image_url: product.image_url,
        variants: product.product_variants.map((v) => ({
          id: v.id,
          quantity_per_box: Number(v.quantity_per_box),
          price: Number(v.price),
          is_active: Boolean(v.is_active),
          sku_code: v.sku_code,
          orginal_price: v.orginal_price ? Number(v.orginal_price) : undefined,
        })),
      };

      const response = await api.put(
        `/products/update/${productId}`,
        payload,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      if (response.data.success) {
        toast.success("Product updated successfully");
        router.push("/admin/noob/products");
      } else {
        toast.error(response.data.message || "Failed to update product");
      }
    } catch (error) {
      toast.error("Failed to update product");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-bold mb-6 text-[#014421]">Edit Product</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4 bg-white p-4 rounded-lg shadow">
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <label className="block mb-2">Description (HTML)</label>
          <textarea
            name="description"
            value={product.description || ""}
            onChange={handleInputChange}
            rows={6}
            className="w-full p-2 border rounded font-mono"
            placeholder="<p>Rich HTML description...</p>"
          />
          <div className="mt-2 p-3 border rounded bg-white">
            <div className="text-sm text-gray-600 mb-1">Preview</div>
            <div dangerouslySetInnerHTML={{ __html: product.description || "" }} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow space-y-2">
          <label className="block mb-2">Image URL</label>
          <input
            type="text"
            name="image_url"
            value={product.image_url || ""}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
          {product.image_url ? (
            <img src={product.image_url} alt="Product" className="mt-2 h-24 object-cover rounded" />
          ) : null}
        </div>
        <div className="lg:col-span-3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Variants</h2>
          {product.product_variants.map((variant, index) => (
            <div
              key={variant.id ?? index}
              className={`flex gap-4 mb-4 items-end ${variant.is_active ? "" : "opacity-60"}`}
            >
              <div>
                <label className="block mb-2">Quantity Per Box</label>
                <input
                  type="number"
                  value={variant.quantity_per_box}
                  onChange={(e) =>
                    handleVariantChange(
                      index,
                      "quantity_per_box",
                      e.target.value
                    )
                  }
                  className="w-32 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Price</label>
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(index, "price", e.target.value)
                  }
                  className="w-32 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Original Price</label>
                <input
                  type="number"
                  value={variant.orginal_price}
                  onChange={(e) =>
                    handleVariantChange(index, "orginal_price", e.target.value)
                  }
                  className="w-32 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">SKU Code</label>
                <input
                  type="text"
                  value={variant.sku_code}
                  onChange={(e) =>
                    handleVariantChange(index, "sku_code", e.target.value)
                  }
                  className="w-32 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">Active</label>
                <input
                  type="checkbox"
                  checked={variant.is_active}
                  onChange={(e) =>
                    handleVariantChange(index, "is_active", e.target.checked)
                  }
                  className="p-2"
                />
              </div>
              {variant.is_active ? (
                <button
                  type="button"
                  onClick={() => setVariantActive(index, false)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setVariantActive(index, true)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Restore
                </button>
              )}
            </div>
          ))}
          {/* Adding new variants is not supported by the current update API */}
        </div>
        <div className="lg:col-span-3 flex gap-4">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/noob/products")}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
