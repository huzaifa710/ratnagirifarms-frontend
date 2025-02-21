import { Link } from "wouter";
import { ShoppingCart, Heart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categories } from "@/lib/data";

export default function Navbar() {
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold text-primary">Farm2You</a>
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link href="/">
              <a className="hover:text-primary">Home</a>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 hover:text-primary">
                Category <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id}>
                    <Link href={`/category/${category.id}`}>
                      <a className="w-full">{category.name}</a>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/cart">
              <a className="hover:text-primary">My Wishlist</a>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}