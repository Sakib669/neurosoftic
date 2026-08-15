// components/shared/Footer.tsx
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary-container text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Company */}
        <div>
          <h3 className="text-xl font-bold mb-4">Neurosoftic Motors</h3>
          <p className="text-sm opacity-80 leading-relaxed">
            Your trusted destination for quality pre‑owned and new vehicles. We
            make car buying simple and transparent.
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            <a href="#" className="hover:underline">
              Facebook
            </a>
            <a href="#" className="hover:underline">
              Instagram
            </a>
            <a href="#" className="hover:underline">
              Twitter
            </a>
            <a href="#" className="hover:underline">
              YouTube
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/products" className="hover:underline">
                Browse Cars
              </Link>
            </li>
            <li>
              <Link href="/products?category=suv" className="hover:underline">
                SUVs
              </Link>
            </li>
            <li>
              <Link href="/products?category=sedan" className="hover:underline">
                Sedans
              </Link>
            </li>
            <li>
              <Link href="/products?category=truck" className="hover:underline">
                Trucks
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:underline">
                Search
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/contact" className="hover:underline">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/faq" className="hover:underline">
                FAQ
              </Link>
            </li>
            <li>
              <Link href="/financing" className="hover:underline">
                Financing
              </Link>
            </li>
            <li>
              <Link href="/trade-in" className="hover:underline">
                Trade‑In
              </Link>
            </li>
            <li>
              <Link href="/warranty" className="hover:underline">
                Warranty
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 flex-shrink-0" />
              <span>123 Auto Plaza, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="flex-shrink-0" />
              <a href="tel:+1234567890" className="hover:underline">
                +1 234 567 890
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="flex-shrink-0" />
              <a
                href="mailto:sales@neurosoftic.com"
                className="hover:underline"
              >
                sales@neurosoftic.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-on-primary-container/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm opacity-80">
          <p>© 2026 Neurosoftic Motors. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
