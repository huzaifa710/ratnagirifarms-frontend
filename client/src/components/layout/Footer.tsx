import { Link } from "wouter";
import { MapPin, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#556B2F] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Us */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <p className="text-white/90 mb-4">
              We specialize in delivering premium Alphonso mangoes straight to
              your doorstep, ensuring the finest quality every time!
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
                <p className="text-white/90">
                  Farm2You
                  <br />
                  Kalkai Kond, Dapoli Khed road, Dapoli,
                  <br />
                  District Ratnagiri, Maharashtra 415712.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <a href="mailto:support@farm2you.in" className="text-white/90 hover:text-white">
                  support@farm2you.in
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <a href="tel:+918554819692" className="text-white/90 hover:text-white">
                  +91 85548 19692
                </a>
              </div>
              <p className="text-white/90">FSSAI: 11523025000404</p>
            </div>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Important Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/blog">
                  <a className="text-white/90 hover:text-white">Blog</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a className="text-white/90 hover:text-white">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/partner">
                  <a className="text-white/90 hover:text-white">Partner With Us</a>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <a className="text-white/90 hover:text-white">Contact Us</a>
                </Link>
              </li>
              <li>
                <Link href="/faqs">
                  <a className="text-white/90 hover:text-white">FAQs</a>
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Policies */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Business Policies</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms">
                  <a className="text-white/90 hover:text-white">Terms & Conditions</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <a className="text-white/90 hover:text-white">Privacy Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/refund">
                  <a className="text-white/90 hover:text-white">Cancellation & Refund Policy</a>
                </Link>
              </li>
              <li>
                <Link href="/shipping">
                  <a className="text-white/90 hover:text-white">Shipping Policy</a>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Payment Methods */}
        <div className="mt-12 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/90">Copyright 2023. All Rights Reserved CANGO.</p>
            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <img src="/payment/visa.png" alt="Visa" className="h-6" />
              <img src="/payment/mastercard.png" alt="Mastercard" className="h-6" />
              <img src="/payment/rupay.png" alt="RuPay" className="h-6" />
              <img src="/payment/upi.png" alt="UPI" className="h-6" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}