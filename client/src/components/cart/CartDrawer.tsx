import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Minus, Plus, ShoppingBasket, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  // Demo empty cart state
  const isEmpty = true;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="mt-8 h-[calc(100vh-12rem)] flex flex-col">
          {isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBasket className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="font-semibold text-lg">Your cart is empty</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                Looks like you haven't made up your mind yet
              </p>
              <Link href="/">
                <Button onClick={onClose}>Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto">
                {/* Cart items would be mapped here */}
                <div className="flex gap-4 py-4">
                  <img
                    src="https://www.farm2you.in/uploads/products/2024/03/13/65f194ef7691d1-41469246.png"
                    alt="Product"
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Ratnagiri Alphonso Mango</h4>
                      <button onClick={() => {}} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">12 pieces</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">1</span>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <span className="font-semibold">₹899</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Separator className="mb-4" />
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">₹899</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹899</span>
                  </div>
                </div>

                <div className="grid gap-2 mt-4">
                  <Link href="/checkout">
                    <Button className="w-full" size="lg" onClick={onClose}>
                      Checkout
                    </Button>
                  </Link>
                  <Link href="/cart">
                    <Button variant="outline" className="w-full" onClick={onClose}>
                      View Cart
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
