import { Link } from "wouter";
import { ShoppingCart, Search, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Navbar() {
  return (
    <header>
      {/* Season Banner */}
      <div className="bg-[#556B2F] text-white py-2 text-center text-sm">
        Thank you, everyone! The 2024 Alphonso mango season has come to a close. Stay tuned for updates and exciting new products.
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link href="/">
            <a>
              <img src="/logo.png" alt="Farm2You" className="h-12" />
            </a>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="I'm searching for..."
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Maharashtra
            </Button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#F4A034]">
        <div className="container mx-auto px-4">
          <ul className="flex items-center space-x-8 py-3">
            <li>
              <Link href="/">
                <a className="text-white hover:text-white/80">Home</a>
              </Link>
            </li>
            <li>
              <Link href="/category/ratnagiri">
                <a className="text-white hover:text-white/80">Ratnagiri Alphonso</a>
              </Link>
            </li>
            <li>
              <Link href="/category/devgad">
                <a className="text-white hover:text-white/80">Devgad Alphonso</a>
              </Link>
            </li>
            <li>
              <Link href="/bulk-order">
                <a className="text-white hover:text-white/80">Bulk Order</a>
              </Link>
            </li>
            <li>
              <Link href="/corporate">
                <a className="text-white hover:text-white/80">Corporate Gifting</a>
              </Link>
            </li>
            <li>
              <Link href="/partner">
                <a className="text-white hover:text-white/80">Partner With Us</a>
              </Link>
            </li>
            <li>
              <Link href="/contact">
                <a className="text-white hover:text-white/80">Contact Us</a>
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}