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

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      product_variants: [
        ...prev.product_variants,
        {
          quantity_per_box: "",
          price: "",
          orginal_price: "",
          sku_code: "",
          is_active: true,
        },
      ],
    }));
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-center" />
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
        <p className="text-gray-600 mt-1">
          Manage product details and variants.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (HTML)
              </label>
              <textarea
                name="description"
                value={product.description || ""}
                onChange={handleInputChange}
                rows={8}
                className="w-full p-3 border border-gray-300 rounded-md font-mono focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="<p>Enter a rich HTML description for your product...</p>"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="image_url"
                value={product.image_url || ""}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
              {product.image_url && (
                <img
                  src={product.image_url}
                  alt="Product"
                  className="mt-4 h-32 w-full object-cover rounded-md"
                />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Variants</h2>
            <button
              type="button"
              onClick={addVariant}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add Variant
            </button>
          </div>

          <div className="space-y-6">
            {product.product_variants.map((variant, index) => (
              <div
                key={variant.id || index}
                className={`p-4 border rounded-md ${
                  variant.is_active ? "border-gray-300" : "border-red-300 bg-red-50"
                }`}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={variant.quantity_per_box}
                      onChange={(e) =>
                        handleVariantChange(index, "quantity_per_box", e.target.value)
                      }
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="number"
                      value={variant.price}
                      onChange={(e) =>
                        handleVariantChange(index, "price", e.target.value)
                      }
                      className="w-full p-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Original Price
                    </label>
                    <input
                      type="number"
                      value={variant.orginal_price}
                      onChange={(e) =>
                        handleVariantChange(index, "orginal_price", e.target.value)
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SKU Code
                    </label>
                    <input
                      type="text"
                      value={variant.sku_code}
                      onChange={(e) =>
                        handleVariantChange(index, "sku_code", e.target.value)
                      }
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={variant.is_active}
                        onChange={(e) =>
                          handleVariantChange(index, "is_active", e.target.checked)
                        }
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700">Active</label>
                    </div>
                    {variant.is_active ? (
                      <button
                        type="button"
                        onClick={() => setVariantActive(index, false)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setVariantActive(index, true)}
                        className="text-yellow-600 hover:text-yellow-800"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 text-lg font-semibold"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/noob/products")}
            className="bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 text-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
