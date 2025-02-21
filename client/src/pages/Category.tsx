import { useParams, Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";

// Sample data structure - replace with actual data
const categoryProducts = {
  ratnagiri: {
    name: "Ratnagiri Alphonso",
    products: [
      {
        id: 1,
        name: "Ratnagiri Alphonso Mango (Regular 180-210g)",
        price: 899,
        image: "/products/ratnagiri-regular.png",
        sizes: [
          { pieces: 12, available: true },
          { pieces: 24, available: true }
        ],
        inStock: false
      },
      {
        id: 2,
        name: "Ratnagiri Alphonso Mango (King 250-300g)",
        price: 999,
        image: "/products/ratnagiri-king.png",
        sizes: [
          { pieces: 12, available: true },
          { pieces: 24, available: true }
        ],
        inStock: false
      },
      // Add more products...
    ]
  },
  devgad: {
    name: "Devgad Alphonso",
    products: [
      {
        id: 3,
        name: "Devgad Alphonso Mango (Regular Size)",
        price: 1099,
        image: "/products/devgad-regular.png",
        sizes: [
          { pieces: 12, available: true },
          { pieces: 24, available: true }
        ],
        inStock: false
      },
      // Add more products...
    ]
  }
};

export default function Category() {
  const { id } = useParams();
  const category = categoryProducts[id as keyof typeof categoryProducts];

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Category not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{category.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}