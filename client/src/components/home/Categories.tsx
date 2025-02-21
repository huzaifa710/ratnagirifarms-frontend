import { categories } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Categories() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{category.name}</h3>
                  <Link href={`/category/${category.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View all
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}