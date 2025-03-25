import styles from "./page.module.css";
import Image from "next/image";
import Link from "next/link";
import { FaTruck, FaLeaf, FaMedal } from "react-icons/fa";

export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBackground}>
        <Image
          src="/home/hero-5.webp"
          alt="Hero Image"
          fill
          style={{ objectFit: "cover" }}
          priority
        />
        <div className={styles.overlay}></div>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>
          TASTE THE FINEST RATNAGIRI ALPHONSO MANGOES
        </h1>
        <h2 className={styles.heroSubtitle}>
          Experience Premium Quality, Direct from Our Orchards
        </h2>
        <p className={styles.heroText}>
          Handpicked, naturally ripened, and carefully delivered to ensure the perfect taste of authentic Ratnagiri Alphonso mangoes.
        </p>

        <div className={styles.trustPoints}>
          <div className={styles.trustPoint}>
            <FaTruck className={styles.trustIcon} />
            <span>For Now Delivering Only In Mumbai/Pune</span>
          </div>
          <div className={styles.trustPoint}>
            <FaLeaf className={styles.trustIcon} />
            <span>100% Organic</span>
          </div>
          <div className={styles.trustPoint}>
            <FaMedal className={styles.trustIcon} />
            <span>Premium Quality</span>
          </div>
        </div>

        <Link href="/products">
          <button className={styles.heroButton}>Order Now</button>
        </Link>
      </div>
    </section>
  );
}