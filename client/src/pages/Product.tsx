import { useParams } from "wouter";
import { useState } from "react";
import { products } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Product() {
  const { id } = useParams();
  const [selectedSize, setSelectedSize] = useState<string>();
  
  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${product.name} view ${index + 1}`}
              className="w-full rounded-lg"
            />
          ))}
        </div>
        
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {product.tags.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
          
          <div className="text-3xl font-bold">₹{product.price}</div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              No of pieces per box
            </label>
            <Select
              value={selectedSize}
              onValueChange={setSelectedSize}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {product.sizes.map(size => (
                  <SelectItem key={size} value={size.toString()}>
                    {size} pieces
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            size="lg"
            className="w-full"
            disabled={!product.inStock || !selectedSize}
          >
            {product.inStock ? "Add to Cart" : "Out of Stock"}
          </Button>
        </div>
      </div>
    </div>
  );
}
