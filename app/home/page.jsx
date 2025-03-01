import Hero from "@/app/component/hero/page";
// import ProductSection from "@/components/home/ProductSection";
// import Testimonials from "@/components/home/Testimonials";
// import Gallery from "@/components/home/Gallery";
import ProductCard from "@/app/component/productCard/page";

export default function HomePage() {
  return (
    <div>
      <div>
        <Hero />
        <ProductCard />
        {/* other components */}
      </div>
    </div>
  );
}
