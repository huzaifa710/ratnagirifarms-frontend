import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import ProductSection from "@/components/home/ProductSection";
import Testimonials from "@/components/home/Testimonials";
import Gallery from "@/components/home/Gallery";

export default function Home() {
  return (
    <div>
      <Hero />
      <Categories />
      <ProductSection category="Ratnagiri Alphonso" />
      <ProductSection category="Devgad Alphonso Mango" />
      <Testimonials />
      <Gallery />
    </div>
  );
}
