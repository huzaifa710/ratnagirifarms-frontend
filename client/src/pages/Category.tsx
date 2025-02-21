import { useParams } from "wouter";
import { categories, products } from "@/lib/data";
import ProductCard from "@/components/product/ProductCard";

export default function Category() {
  const { id } = useParams();
  const category = categories.find(c => c.id === Number(id));
  const categoryProducts = products.filter(p => p.category === category?.name);

  if (!category) {
    return <div className="container mx-auto px-4 py-8">Category not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">{category.name}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
