"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { FaQuoteLeft, FaChevronLeft, FaChevronRight } from "react-icons/fa";
const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Mumbai",
    text: "The mangoes from Ratnagiri Farms are absolutely delicious! The taste and quality are unmatched. Will definitely order again.",
  },
  {
    id: 2,
    name: "Priya Shah",
    location: "Mumbai",
    text: "Fresh, sweet, and perfectly ripened mangoes delivered right to my doorstep. Amazing service and product quality!",
  },
  {
    id: 3,
    name: "Amit Patel",
    location: "Pune",
    text: "Best Alphonso mangoes I've ever had. The packaging was excellent and the fruits were in perfect condition.",
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
                <p className={styles.testimonialText}>{testimonial.text}</p>
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
