"use client";
import { useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';

const galleryImages = [
  {
    id: 1,
    src: "/gallery/gallery1.webp",
    alt: "Mango Farm View",
  },
  {
    id: 2,
    src: "/gallery/gallery2.webp",
    alt: "Mango Packing Process",
  },
  {
    id: 3,
    src: "/gallery/gallery3.webp",
    alt: "Fresh Mangoes",
  },
  {
    id: 4,
    src: "/gallery/gallery4.webp",
    alt: "Mango Trees",
  },
  {
    id: 5,
    src: "/gallery/gallery5.webp",
    alt: "Mango Harvesting",
  },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <section className={styles.gallerySection}>
      <div className={styles.galleryGrid}>
        {galleryImages.map((image) => (
          <div 
            key={image.id} 
            className={styles.galleryItem}
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.galleryImage}
            />
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className={styles.modal} onClick={() => setSelectedImage(null)}>
          <div className={styles.modalContent}>
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              fill
              sizes="100vw"
              className={styles.modalImage}
            />
          </div>
        </div>
      )}
    </section>
  );
}