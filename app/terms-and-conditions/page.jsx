"use client";
import styles from "./page.module.css";
import Link from "next/link";

export default function Terms() {
  return (
    <div className={styles.termsContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>Terms and Conditions</h1>

        <div className={styles.section}>
          <p className={styles.intro}>
            Please read the following terms and conditions carefully as your use
            of our service is subject to your acceptance of and compliance with
            these terms and conditions.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Website Ownership</h2>
          <p>
            The domain name www.ratnagirifarms.com (hereinafter referred to as
            "Website") is owned by Ratnagiri Farms, operating as a
            proprietorship (hereinafter referred to as "Ratnagiri Farms").
          </p>
        </div>

        <div className={styles.section}>
          <h2>Agreement to Terms</h2>
          <p>
            By placing an order or creating an account on our website, you agree
            to all of our:
          </p>
          <ul className={styles.policyList}>
            <li>
              <Link href="/refund-returns">Refund and Return Policy</Link>
            </li>
            <li>Privacy and Cookies Policy</li>
            <li>Cancellation Policy</li>
            <li>Shipping Policy</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Contract Formation</h2>
          <p>
            By using the website, you are entering into a contract with
            Ratnagiri Farms, and these terms and conditions, along with our
            policies, constitute your legally binding obligations to Ratnagiri
            Farms.
          </p>
        </div>

        <div className={styles.section}>
          <h2>User Definition</h2>
          <p>
            "You" or "User" refers to any natural or legal person who becomes a
            member of the Website by providing Registration Data while
            registering on the Website as a Registered User. Users can browse
            the website and make purchases without registering.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Modifications to Terms</h2>
          <p>
            We reserve the right to modify these Terms of Use at any time at our
            sole discretion without prior written notice. It is your
            responsibility to regularly check for updates. Continued use of the
            Website after changes constitutes acceptance of the modified terms.
          </p>
        </div>

        <div className={styles.section}>
          <h2>Account Security</h2>
          <p>When using the Website, you are responsible for:</p>
          <ul>
            <li>
              Maintaining the confidentiality of your Login Name and Password
            </li>
            <li>All activities occurring under your Login Name</li>
            <li>Ensuring secure access to your account</li>
          </ul>
        </div>

        <div className={styles.section}>
          <h2>Contact Information</h2>
          <p>
            For any questions regarding these terms and conditions, please
            contact us at:
          </p>
          <div className={styles.contactInfo}>
            <p>Email: support@ratnagirifarms.com</p>
            {/* <p>Phone: +91 85548 19692</p> */}
            <p>
              Address: Bankot, Tal. Mandangad, District Ratnagiri, Maharashtra
              415208
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
