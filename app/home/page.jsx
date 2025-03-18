"use client";
import { useEffect, useRef } from "react";
import Hero from "@/app/component/hero/page";
import ProductCard from "@/app/component/productCard/page";
import Testimonials from "@/app/component/testmonials/page";
import Gallery from "@/app/component/gallery/page";
import styles from "./page.module.css";

export default function Home() {
  const productRef = useRef(null);
  const testimonialRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "20px",
      }
    );

    const sections = [productRef.current, testimonialRef.current, galleryRef.current];
    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <main className={styles.main}>
      <Hero />
      <section
        ref={productRef}
        className={`${styles.productSection} ${styles.section} ${styles.fadeIn} ${styles.delaySmall}`}
      >
        <h2 className={styles.sectionTitle}>Premium Alphonso Mangoes</h2>
        <ProductCard />
      </section>
      
      <section
        ref={testimonialRef}
        className={`${styles.testimonialSection} ${styles.section} ${styles.fadeIn} ${styles.delayMedium}`}
      >
        <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
        <Testimonials />
      </section>
      
      <section
        ref={galleryRef}
        className={`${styles.gallerySection} ${styles.section} ${styles.fadeIn} ${styles.delayLarge}`}
      >
        <h2 className={styles.sectionTitle}>Our Heritage</h2>
        <Gallery />
      </section>
    </main>
  );
}