import styles from "./page.module.css";
import { Mail } from "lucide-react";

export default function ShippingPolicy() {
  return (
    <div className={styles.policyContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>Shipping Policy</h1>

        <div className={styles.section}>
          <p className={styles.intro}>
            Thank you for choosing Ratnagiri Farms! We are committed to
            delivering fresh, premium Alphonso mangoes directly to your
            doorstep. Please read our shipping policy to understand our delivery
            process.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Shipping Locations</h2>
          <p>Delivering all over Maharashtra.</p>
        </div>

        <div className={styles.section}>
          <h2>Order Processing</h2>
          <ul>
            <li>
              Orders are typically processed within 24 hours of confirmation
            </li>
            <li>
              During peak mango season (March-May), processing times may be
              extended due to high demand
            </li>
            <li>
              Orders placed on weekends or public holidays will be processed on
              the next business day
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Delivery Timeline</h2>
          <ul>
            <li>Metropolitan Cities: 2-3 Days</li>
            <li>Tier 2 & 3 Cities: Within one week</li>
            <li>
              Delivery times may vary based on weather conditions and logistics
              partner availability
            </li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Order Tracking</h2>
          <p>
            Once your order is dispatched, you will receive a tracking link via
            email and SMS to monitor your delivery status.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Important Notes</h2>
          <ul>
            <li>
              We use specialized packaging to ensure mangoes arrive in perfect
              condition
            </li>
            <li>
              Deliveries are handled by professional courier partners
              experienced in handling perishable items
            </li>
            <li>
              In case of any delivery delays, our team will keep you updated
            </li>
            <li>
              For any damage during transit, please document with photos/videos
              before opening the package
            </li>
          </ul>
        </div>

        <div className={styles.contactSection}>
          <h2>Need Assistance?</h2>
          <p>
            For any shipping-related queries, please contact our support team:
          </p>

          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Mail className={styles.icon} />
              <a href="mailto:support@ratnagirifarms.com">
                support@ratnagirifarms.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
