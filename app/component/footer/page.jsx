import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import styles from "./page.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Contact Us Section */}
          <div>
            <h3 className={styles.heading}>Contact Us</h3>
            <p className={styles.text}>
              We specialize in delivering premium Alphonso mangoes straight to
              your doorstep, ensuring the finest quality every time!
            </p>
            <br />
            <div className={styles.listContainer}>
              <div className={styles.contactInfo}>
                <MapPin className={styles.icon} />
                <p className={styles.text}>
                  Ratnagiri Farms
                  <br />
                  Bankot, Tal. Mandangad,
                  <br />
                  District Ratnagiri, Maharashtra 415208.
                </p>
              </div>
              <div className={styles.contactInfo}>
                <Mail className={styles.icon} />
                <a href="mailto:support@ratnagirifarms.com" className={styles.link}>
                  support@ratnagirifarms.com
                </a>
              </div>
              <div className={styles.contactInfo}>
                <Phone className={styles.icon} />
                <a href="tel:+918459734158" className={styles.link}>
                  +91 84597 34158
                </a>
              </div>
              <p className={styles.text}>FSSAI: 21523025000167</p>
              <p className={styles.text}>
                © 2025 Ratnagiri Farms — A venture of{" "}
                <strong>Ayaan Mango Trading</strong>
              </p>
            </div>
          </div>

          {/* Links Wrapper for side-by-side sections */}
          <div className={styles.linksWrapper}>
            {/* <div>
              <h3 className={styles.heading}>Important Links</h3>
              <ul className={styles.listContainer}>
                <li>
                  <Link href="/about-us" className={styles.link}>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/partner-with-us" className={styles.link}>
                    Partner With Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className={styles.link}>
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div> */}

            {/* Business Policy Section */}
            <div>
              <h3 className={styles.heading}>Business Policies</h3>
              <ul className={styles.listContainer}>
                <li>
                  <Link href="/terms-and-conditions" className={styles.link}>
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className={styles.link}>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/refund-returns" className={styles.link}>
                    Cancellation & Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className={styles.link}>
                    Shipping Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* Payment Section */}
          {/* <div className={styles.divider}>
            <div className={styles.paymentSection}>
              <p className={styles.text}>
                Copyright 2023. All Rights Reserved CANGO.
              </p>
              <div className={styles.paymentIcons}>
                <img
                  src="/payment/visa.png"
                  alt="Visa"
                  className={styles.paymentIcon}
                />
                <img
                  src="/payment/mastercard.png"
                  alt="Mastercard"
                  className={styles.paymentIcon}
                />
                <img
                  src="/payment/rupay.png"
                  alt="RuPay"
                  className={styles.paymentIcon}
                />
                <img
                  src="/payment/upi.png"
                  alt="UPI"
                  className={styles.paymentIcon}
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
