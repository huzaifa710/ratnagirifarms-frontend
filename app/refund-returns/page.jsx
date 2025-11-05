"use client";
import styles from "./page.module.css";
import { Mail, Phone } from "lucide-react";

export default function RefundPolicy() {
  return (
    <div className="page-container">
      <div className="content-wrapper">
        <h1 className="page-title">Refund & Returns Policy</h1>

        <div className="content-section">
          <h2>Order Cancellation</h2>
          <p>
            It is possible to cancel orders placed and processed through the
            website from your user account within the same day before the
            order is shipped.
          </p>
        </div>

        <div className="content-section">
          <h2>Delivery & Returns</h2>
          <ul>
            <li>
              Once the mango is ready for delivery, no return or refund will be
              provided.
            </li>
            <li>
              Delivery will be completed within 3-7 days according to the
              estimated delivery time with our delivery partner.
            </li>
            <li>
              Ratnagiri Farms will coordinate with the logistics partner and
              inform you of any delays or delivery issues.
            </li>
          </ul>
        </div>

        <div className="content-section">
          <h2>Damage Claims</h2>
          <p>
            Contact us immediately if the mangoes were damaged, pressed,
            squeezed, or crushed, or if there was a delay in delivery. Please
            provide necessary evidence (images or video) so we can take
            appropriate action.
          </p>
        </div>

        <div className="content-section">
          <h2>Refund Process</h2>
          <ul>
            <li>
              Refunds will be processed through the same payment method used for
              the purchase.
            </li>
            <li>
              Refunds will be processed within seven working days of mutual
              agreement.
            </li>
            <li>
              Please allow 4-7 business days for the refund amount to be
              credited to your account.
            </li>
          </ul>
        </div>

        <div className="content-section">
          <h2>Important Notes</h2>
          <ul>
            <li>
              We strictly enforce no Replacement, Exchange, or Return policy as
              Alphonso mango is a perishable product.
            </li>
            <li>
              Mangoes are natural products and may be affected by unpredictable
              weather conditions.
            </li>
            <li>
              Ratnagiri Farms and our transport partners are not responsible for
              delays or non-delivery due to accidents, natural calamities, or
              circumstances beyond our reasonable control.
            </li>
          </ul>
        </div>

        <div className={styles.contactSection}>
          <h2>Need Help?</h2>
          <p>
            Contact our customer support team for questions related to refunds,
            returns, or exchanges:
          </p>

          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Mail className={styles.icon} />
              <a href="mailto:support@ratnagirifarms.com">
                support@ratnagirifarms.com
              </a>
            </div>
            <div className={styles.contactItem}>
              <Phone className={styles.icon} />
              <a href="tel:+918459734158">+91 84597 34158</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
