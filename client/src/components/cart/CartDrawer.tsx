
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Minus, Plus, ShoppingBasket, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/stores/cart";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { items, total, removeItem, updateQuantity } = useCart();
  const isEmpty = items.length === 0;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4">
            <ShoppingBasket className="h-16 w-16 text-gray-400" />
            <p className="text-lg font-medium">Your cart is empty</p>
            <Button onClick={onClose} variant="outline">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-6">
              {items.map((item) => (
                <div key={item.id} className="flex py-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-24 w-24 object-cover rounded-md"
                  />
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium">{item.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                        className="p-1"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-2 min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <div className="flex justify-between text-base font-medium">
                <p>Subtotal</p>
                <p>₹{total}</p>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Shipping calculated at checkout
              </p>
              <div className="mt-6">
                <Link href="/checkout">
                  <Button className="w-full" onClick={onClose}>
                    Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
