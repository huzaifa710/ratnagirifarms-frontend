import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      {/* Background Image */}
      <div className={styles.heroBackground}>
        <Image
          src="/home/hero-5.png"
          alt="Hero Image"
          fill
          style={{ objectFit: "cover" }} // Replace objectFit prop with style
          priority
        />
        <div className={styles.overlay}></div>
      </div>

      {/* Hero Content */}
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          TASTE THE FINEST RATNAGIRI ALPHONSO MANGOES
        </h1>
        <p className={styles.heroText}>
          Directly from our farms to your doorstep. Pure, organic, and
          delicious.
        </p>
        <Link href="/product">
          <button className={styles.heroButton}>Order Now</button>{" "}
        </Link>
      </div>
    </section>
  );
}
