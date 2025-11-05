"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-context/page";
import api from "@/utils/axios";
import { toast, Toaster } from "react-hot-toast";

export default function NewProduct() {
  const router = useRouter();
  const { accessToken } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    image_url: "",
    variants: [
      {
        quantity_per_box: "",
        price: "",
        is_active: true,
        sku_code: "",
        orginal_price: "",
      },
    ],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index, field, value) => {
    setProduct((prev) => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const addVariant = () => {
    setProduct((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          quantity_per_box: "",
          price: "",
          is_active: true,
          sku_code: "",
          orginal_price: "",
        },
      ],
    }));
  };

  const removeVariant = (index) => {
    setProduct((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!accessToken) {
      toast.error("You are not authorized");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: product.name,
        description: product.description,
        image_url: product.image_url,
        variants: product.variants.map((v) => ({
          quantity_per_box: Number(v.quantity_per_box),
          price: Number(v.price),
          is_active: Boolean(v.is_active),
          sku_code: v.sku_code || undefined,
          orginal_price: v.orginal_price ? Number(v.orginal_price) : undefined,
        })),
      };

      const response = await api.post("/products/create", payload, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (response.data.success) {
        toast.success("Product created successfully");
        router.push("/admin/noob/products");
      } else {
        toast.error(response.data.message || "Failed to create product");
      }
    } catch (error) {
      toast.error("Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Toaster position="top-center" />
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
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

        <div>
          <label className="block mb-2">Description (HTML)</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded font-mono"
            rows={6}
            placeholder="<p>Rich HTML description...</p>"
          />
          <div className="mt-2 p-3 border rounded bg-white">
            <div className="text-sm text-gray-600 mb-1">Preview</div>
            <div dangerouslySetInnerHTML={{ __html: product.description || "" }} />
          </div>
        </div>

        <div>
          <label className="block mb-2">Image URL</label>
          <input
            type="text"
            name="image_url"
            value={product.image_url}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">Variants</h2>
          {product.variants.map((variant, index) => (
            <div key={index} className="flex flex-wrap gap-4 mb-4 items-end">
              <div>
                <label className="block mb-2">Quantity Per Box</label>
                <input
                  type="number"
                  value={variant.quantity_per_box}
                  onChange={(e) =>
                    handleVariantChange(index, "quantity_per_box", e.target.value)
                  }
                  className="w-40 p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Price</label>
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                  className="w-40 p-2 border rounded"
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
                  className="w-40 p-2 border rounded"
                />
              </div>
              <div>
                <label className="block mb-2">SKU Code</label>
                <input
                  type="text"
                  value={variant.sku_code}
                  onChange={(e) => handleVariantChange(index, "sku_code", e.target.value)}
                  className="w-40 p-2 border rounded"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="block">Active</label>
                <input
                  type="checkbox"
                  checked={variant.is_active}
                  onChange={(e) =>
                    handleVariantChange(index, "is_active", e.target.checked)
                  }
                  className="p-2"
                />
              </div>
              {product.variants.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Variant
          </button>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={submitting}
            className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Product"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}


