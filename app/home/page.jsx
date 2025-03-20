"use client";
import { useEffect, useRef, useState } from "react";
import Hero from "@/app/component/hero/page";
import ProductCard from "@/app/component/productCard/page";
import Testimonials from "@/app/component/testmonials/page";
import Gallery from "@/app/component/gallery/page";
import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { FaLeaf, FaMedal, FaTruck, FaArrowRight } from "react-icons/fa";

export default function Home() {
  const productRef = useRef(null);
  const testimonialRef = useRef(null);
  const galleryRef = useRef(null);
  const featureRef = useRef(null);
  const whyUsRef = useRef(null);
  const [activeTab, setActiveTab] = useState("alphonso");

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

    const sections = [
      productRef.current,
      testimonialRef.current,
      galleryRef.current,
      featureRef.current,
      whyUsRef.current,
    ];
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

      {/* Featured Products Section with Tabs */}
      <section
        ref={productRef}
        className={`${styles.productSection} ${styles.section} ${styles.fadeIn} ${styles.delaySmall}`}
      >
        <h2 className={styles.sectionTitle}>Our Premium Offerings</h2>

        <ProductCard category={activeTab} />

        <div className={styles.viewAllContainer}>
          <Link href="/product" className={styles.viewAllButton}>
            View All Products <FaArrowRight className={styles.arrowIcon} />
          </Link>
        </div>
      </section>

      {/* Benefits/Features Section */}
      <section
        ref={featureRef}
        className={`${styles.featureSection} ${styles.section} ${styles.fadeIn}`}
      >
        <h2 className={styles.sectionTitle}>Why Choose Ratnagiri Farms</h2>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaLeaf className={styles.featureIcon} />
            </div>
            <h3>100% Organic</h3>
            <p>
              All our produce is grown using organic farming practices, free
              from harmful chemicals and pesticides.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaMedal className={styles.featureIcon} />
            </div>
            <h3>Premium Quality</h3>
            <p>
              Hand-picked and carefully selected fruits to ensure only the best
              reaches your doorstep.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <FaTruck className={styles.featureIcon} />
            </div>
            <h3>Fast Delivery</h3>
            <p>
              From our orchards to your home in the shortest time possible to
              maintain freshness.
            </p>
          </div>
        </div>
      </section>

      {/* Why Us Section with Image */}
      <section
        ref={whyUsRef}
        className={`${styles.whyUsSection} ${styles.section} ${styles.fadeIn}`}
      >
        <div className={styles.whyUsContainer}>
          <div className={styles.whyUsImageContainer}>
            <Image
              src="/home/orchard2.webp"
              alt="Our Ratnagiri Orchards"
              fill
              className={styles.whyUsImage}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className={styles.whyUsContent}>
            <h2>Our Ratnagiri Heritage</h2>
            <p>
              For over 25 years, our family-owned orchards in Ratnagiri have
              been cultivating the finest Alphonso mangoes. Nestled in the
              coastal region of Maharashtra, our mangoes benefit from the unique
              combination of fertile soil, coastal climate, and generations of
              farming expertise.
            </p>
            <p>
              Every mango is allowed to naturally ripen on the tree before being
              carefully harvested by hand to ensure optimal flavor and
              sweetness.
            </p>
            <Link href="/about-us" className={styles.learnMoreButton}>
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section
        ref={testimonialRef}
        className={`${styles.testimonialSection} ${styles.section} ${styles.fadeIn} ${styles.delayMedium}`}
      >
        <h2 className={styles.sectionTitle}>What Our Customers Say</h2>
        <Testimonials />
      </section>

      {/* Instagram/Social Gallery Section */}
      <section
        ref={galleryRef}
        className={`${styles.gallerySection} ${styles.section} ${styles.fadeIn} ${styles.delayLarge}`}
      >
        <h2 className={styles.sectionTitle}>Our Heritage</h2>
        <Gallery />

        <div className={styles.socialContainer}>
          <p className={styles.socialText}>
            Follow us on social media for updates, recipes and special offers
          </p>
          <div className={styles.socialIcons}>
            {/* Add your social media icons here */}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={`${styles.ctaSection} ${styles.section}`}>
        <div className={styles.ctaContainer}>
          <h2>Ready to Taste the Finest Alphonso Mangoes?</h2>
          <p>
            Order now and experience the authentic flavor of Ratnagiri directly
            from our orchards
          </p>
          <Link href="/product" className={styles.ctaButton}>
            Shop Now
          </Link>
        </div>
      </section>
    </main>
  );
}
