import { useParams, Link } from "wouter";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product/ProductCard";

const categoryProducts = {
  "ratnagiri-alphonso": {
    name: "Ratnagiri Alphonso",
    products: [
      {
        id: 1,
        name: "Ratnagiri Alphonso Mango (Regular 180-210g)",
        price: 899,
        images: [
          "https://www.farm2you.in/uploads/products/2024/03/13/65f194ef7691d1-41469246.png",
          "https://www.farm2you.in/uploads/products/2024/03/13/65f194f07b0b50-42745497.png"
        ],
        sizes: [
          { pieces: 12, available: false },
          { pieces: 24, available: false }
        ],
        inStock: false
      },
      {
        id: 2,
        name: "Ratnagiri Alphonso Mango (King 250-300g)",
        price: 999,
        images: [
          "https://www.farm2you.in/uploads/products/2024/03/13/65f193600554a8-23982170.png",
          "https://www.farm2you.in/uploads/products/2024/03/13/65f19361018697-26166161.png"
        ],
        sizes: [
          { pieces: 12, available: false },
          { pieces: 24, available: false }
        ],
        inStock: false
      },
      {
        id: 3,
        name: "Ratnagiri Alphonso Mango (Queen 210-250g)",
        price: 949,
        images: [
          "https://www.farm2you.in/uploads/products/2024/03/13/65f191803374d0-83101497.png",
          "https://www.farm2you.in/uploads/products/2024/03/13/65f19181376cc9-71980808.png"
        ],
        sizes: [
          { pieces: 12, available: false },
          { pieces: 24, available: false }
        ],
        inStock: false
      }
    ]
  },
  "devgad-alphonso": {
    name: "Devgad Alphonso",
    products: [
      {
        id: 4,
        name: "Devgad Alphonso Mango (Regular Size)",
        price: 1099,
        images: [
          "https://www.farm2you.in/uploads/products/2024/03/13/65f18fd01b00b6-34033254.png",
          "https://www.farm2you.in/uploads/products/2024/03/13/65f18fd117ed95-73251743.png"
        ],
        sizes: [
          { pieces: 12, available: false },
          { pieces: 24, available: false }
        ],
        inStock: false
      },
      {
        id: 5,
        name: "Devgad Alphonso Mango (King Size)",
        price: 1329,
        images: [
          "https://www.farm2you.in/uploads/products/2024/03/13/65f1865b9eab37-13345717.png",
          "https://www.farm2you.in/uploads/products/2024/03/13/65f1865c85dda3-48701355.png"
        ],
        sizes: [
          { pieces: 12, available: false },
          { pieces: 24, available: false }
        ],
        inStock: false
      },
      {
        id: 6,
        name: "Devgad Alphonso Mango (Queen Size)",
        price: 1189,
        images: [
          "https://www.farm2you.in/uploads/products/2024/03/12/65f02ad8d2de72-84359186.png",
          "https://www.farm2you.in/uploads/products/2024/03/12/65f02ad9be4d85-02466475.png"
        ],
        sizes: [
          { pieces: 12, available: false },
          { pieces: 24, available: false }
        ],
        inStock: false
      }
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
          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
            <ChevronLeft className="h-6 w-6" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}