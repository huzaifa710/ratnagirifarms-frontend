import styles from "./page.module.css";
import { Mail } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className={styles.policyContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>Privacy Policy</h1>

        <div className={styles.section}>
          <p className={styles.intro}>
            This Privacy Policy describes our policies and procedures on the collection, use and disclosure of your information when you use our service and tells you about your privacy rights and how the law protects you.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Information Collection</h2>
          <p>We collect several different types of information for various purposes to provide and improve our service to you:</p>
          <ul>
            <li>Personal Information (name, email address, phone number, etc.)</li>
            <li>Usage Data (browser type, IP address, time spent on pages)</li>
            <li>Shipping and Billing Information</li>
            <li>Communication Data (your preferences for receiving updates from us)</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Use of Your Information</h2>
          <p>We use the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain our service</li>
            <li>To notify you about changes to our service</li>
            <li>To provide customer support</li>
            <li>To process your transactions</li>
            <li>To send you marketing and promotional communications</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Data Security</h2>
          <p>The security of your data is important to us. While we strive to use commercially acceptable means to protect your personal data, we cannot guarantee its absolute security.</p>
        </div>

        <div className={styles.section}>
          <h2>Cookies Usage</h2>
          <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier.</p>
        </div>

        <div className={styles.section}>
          <h2>Third-Party Services</h2>
          <ul>
            <li>Payment processing services</li>
            <li>Analytics services</li>
            <li>Shipping and delivery services</li>
            <li>Email marketing services</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Children's Privacy</h2>
          <p>Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13.</p>
        </div>

        <div className={styles.section}>
          <h2>Changes to Privacy Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>
        </div>

        <div className={styles.contactSection}>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          
          <div className={styles.contactInfo}>
            <div className={styles.contactItem}>
              <Mail className={styles.icon} />
              <a href="mailto:support@ratnagirifarms.com">support@ratnagirifarms.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}