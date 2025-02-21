import { products } from "@/lib/data";
import ProductCard from "@/components/product/ProductCard";

export default function ProductSection({ category }: { category: string }) {
  const categoryProducts = products.filter(p => p.category === category);
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{category}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
