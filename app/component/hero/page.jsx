import styles from "./page.module.css";
import Image from "next/image";

export default function Hero() {

return (
    <section className={styles.heroSection}>
      {/* Background Image */}
      <div className={styles.heroBackground}>
        <Image
          src="/home/hero-5.png"
          alt="Ratnagiri Mango Farm"
          layout="fill"
          objectFit="cover"
          quality={100}
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
          Directly from our farms to your doorstep. Pure, organic, and delicious.
        </p>
        <button className={styles.heroButton}>Order Now</button>
      </div>
    </section>
  );
}
