import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Minus, Plus, ShoppingBasket } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function Cart() {
  const { items: cartItems, updateQuantity } = useCart();

  const handleQuantityChange = (id: number, change: number) => {
    const newQuantity = Math.max(0, cartItems.find(item => item.id === id)?.quantity + change || 0);
    updateQuantity(id, newQuantity);
      items.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8 text-center">
            <ShoppingBasket className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't made up your mind yet.
            </p>
            <Link href="/">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-[#F4A034] font-bold">₹{item.price}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value, 10) - item.quantity;
                          updateQuantity(item.id, newQuantity);
                        }}
                        className="w-16 text-center"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-4">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-4">Proceed to Checkout</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}