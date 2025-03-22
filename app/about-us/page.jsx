"use client";
import Image from 'next/image';
import styles from './page.module.css';
import { FaLeaf, FaAward, FaTruck } from 'react-icons/fa';

export default function AboutUs() {
  return (
    <section className={styles.aboutSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>About Ratnagiri Farms</h2>
        
        <div className={styles.gridContainer}>
          <div className={styles.imageContainer}>
            <Image
              src="/about/farm1.jpg"
              alt="Ratnagiri Farms"
              width={600}
              height={400}
              className={styles.aboutImage}
            />
          </div>
          
          <div className={styles.contentContainer}>
            <h3 className={styles.subtitle}>Heritage of Excellence</h3>
            <p className={styles.description}>
              Nestled in the pristine coastal region of Ratnagiri, Maharashtra, our farms have been nurturing the finest Alphonso mangoes for generations. We take pride in continuing a legacy of sustainable farming practices that respect both tradition and nature.
            </p>
            
            <div className={styles.features}>
              <div className={styles.feature}>
                <FaLeaf className={styles.icon} />
                <h4>Natural Farming</h4>
                <p>100% organic cultivation ensuring the purest taste</p>
              </div>
              
              <div className={styles.feature}>
                <FaAward className={styles.icon} />
                <h4>Premium Quality</h4>
                <p>Hand-picked and carefully selected mangoes</p>
              </div>
              
              <div className={styles.feature}>
                <FaTruck className={styles.icon} />
                <h4>Direct from Farm</h4>
                <p>Farm to doorstep delivery ensuring freshness</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.statsContainer}>
          <div className={styles.stat}>
            <h3>25+</h3>
            <p>Years of Excellence</p>
          </div>
          <div className={styles.stat}>
            <h3>1000+</h3>
            <p>Happy Customers</p>
          </div>
          <div className={styles.stat}>
            <h3>500+</h3>
            <p>Acres of Orchards</p>
          </div>
        </div>
      </div>
    </section>
  );
}