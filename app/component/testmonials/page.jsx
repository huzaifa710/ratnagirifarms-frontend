"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
const testimonials = [
  {
    id: 1,
    name: "Mihir Shah",
    location: "Mumbai",
    text: "⭐ 5/5 Stars ⭐ If you're a mango lover, these are a must-try. Their perfect balance of sweetness, juiciness, and texture makes them some of the best mangoes out there. Whether eaten alone or used in recipes, they offer a true taste of summer with every bite. Would I buy them again? Absolutely! Thank you very much for this tasty and delicious Mangoes.",
  },
  {
    id: 2,
    name: "Rachana Shenoy",
    location: "Mumbai",
    text: "Best and premium mangoes straight from the land of mangoes Ratnagiri!Have been buying from them since last 3 years! Taste super yumm! Best service and supplies too",
  },
  {
    id: 3,
    name: "Ayesha Anwari",
    location: "Mumbai",
    text: "The quality is excellent and the prices are very reasonable. Definitely worth ordering from!",
  },
  {
    id: 4,
    name: "Mahesh Chandra Bhatt",
    location: "Pune",
    text: "Absolutely Delicious! The Alphonso mangoes I got were incredibly sweet, juicy, and had the perfect texture. Their rich aroma and smooth, buttery flesh make them the best mangoes I’ve ever tasted. Truly the king of mangoes! Will definitely order again.",
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fixed auto-scroll functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []); // Remove currentIndex from dependencies

  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <section className={styles.testimonialSection}>
      <div className={styles.testimonialContainer}>
        <button
          className={styles.navButton}
          onClick={handlePrevious}
          aria-label="Previous testimonial"
        >
          <FaChevronLeft />
        </button>

        <div className={styles.testimonialWrapper}>
          <div
            className={`${styles.testimonialCard} ${
              isAnimating ? styles.animating : ""
            }`}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className={styles.testimonialSlide}>
                <div className={styles.quoteIcon}>
                  <FaQuoteLeft />
                </div>
                <p className={styles.testimonialText}>
                  {testimonial.text}
                </p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorInfo}>
                    <h3>{testimonial.name}</h3>
                    <p>{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className={styles.navButton}
          onClick={handleNext}
          aria-label="Next testimonial"
        >
          <FaChevronRight />
        </button>
      </div>

      <div className={styles.indicators}>
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`${styles.indicator} ${
              currentIndex === index ? styles.active : ""
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
