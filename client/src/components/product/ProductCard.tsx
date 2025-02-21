import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  sizes: {
    pieces: number;
    available: boolean;
  }[];
  inStock: boolean;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = () => {
    if (product.inStock) {
      const existingItem = cart.find((item) => item.id === product.id);
      if (existingItem) {
        setCart(cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ));
      } else {
        setCart([...cart, { ...product, image: product.images[0], quantity: 1 }]);
      }
    }
  };

  return (
    <Card className="overflow-hidden group">
      <CardContent className="p-0">
        <Link href={`/product/${product.id}`}>
          <a className="block relative aspect-square overflow-hidden bg-gray-100">
            <div className="relative w-full h-full">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "/assets/images/default_img.jpg";
                }}
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">Sold Out</span>
                </div>
              )}
            </div>
          </a>
        </Link>

        <div className="p-4 space-y-3">
          <Link href={`/product/${product.id}`}>
            <a className="block text-lg font-semibold text-gray-900 hover:text-[#F4A034] line-clamp-2">
              {product.name}
            </a>
          </Link>

          <div className="text-xl font-bold text-[#F4A034]">
            ₹{product.price.toLocaleString('en-IN')}
          </div>

          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <Badge
                key={size.pieces}
                variant="outline"
                className="px-4 py-1 text-sm border-gray-300"
              >
                {size.pieces}
              </Badge>
            ))}
          </div>

          <Button
            className="w-full bg-[#F4A034] hover:bg-[#F4A034]/90 text-white"
            onClick={addToCart}
            disabled={!product.inStock}
          >
            {product.inStock ? "Add to Cart" : "Sold Out"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}