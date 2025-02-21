import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden group">
      <CardContent className="p-0">
        <Link href={`/product/${product.id}`}>
          <a className="block relative aspect-square overflow-hidden">
            <div className="relative w-full h-full">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">Sold Out</span>
                </div>
              )}
            </div>
          </a>
        </Link>

        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <a className="block text-lg font-semibold text-gray-900 hover:text-primary line-clamp-2 mb-2">
              {product.name}
            </a>
          </Link>

          <div className="space-y-3">
            <div className="text-xl font-bold text-[#F4A034]">₹{product.price.toLocaleString('en-IN')}</div>

            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <Badge
                  key={size.pieces}
                  variant={size.available ? "outline" : "secondary"}
                  className="px-4 py-1 text-sm"
                >
                  {size.pieces}
                </Badge>
              ))}
            </div>

            <Button
              className="w-full bg-[#F4A034] hover:bg-[#F4A034]/90 text-white"
              disabled={!product.inStock}
            >
              {product.inStock ? "Add to Cart" : "Sold Out"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}