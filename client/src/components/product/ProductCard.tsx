import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
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
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </a>
        </Link>

        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <a className="text-lg font-semibold hover:text-primary line-clamp-2">{product.name}</a>
          </Link>

          <div className="mt-2 space-y-3">
            <div className="text-xl font-bold text-primary">₹{product.price}</div>

            <div className="flex gap-2">
              {product.sizes.map((size) => (
                <Badge
                  key={size.pieces}
                  variant={size.available ? "default" : "secondary"}
                  className="px-3 py-1"
                >
                  {size.pieces}
                </Badge>
              ))}
            </div>

            <Button
              className="w-full"
              variant={product.inStock ? "default" : "secondary"}
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