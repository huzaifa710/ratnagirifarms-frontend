import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  price: number;
  images: string[];
  inStock: boolean;
  tags: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden group">
      <CardContent className="p-0">
        <Link href={`/product/${product.id}`}>
          <a className="block relative aspect-square overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {product.tags.map((tag) => (
              <Badge key={tag} className="absolute top-2 left-2">
                {tag}
              </Badge>
            ))}
          </a>
        </Link>
        
        <div className="p-4">
          <Link href={`/product/${product.id}`}>
            <a className="text-lg font-semibold hover:text-primary">{product.name}</a>
          </Link>
          
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xl font-bold">₹{product.price}</span>
            <Button disabled={!product.inStock}>
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
