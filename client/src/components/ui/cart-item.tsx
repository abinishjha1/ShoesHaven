import { useState } from "react";
import { CartItemWithProduct } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";

type CartItemProps = {
  item: CartItemWithProduct;
};

export function CartItem({ item }: CartItemProps) {
  const { product, quantity, size, color } = item;
  const { updateQuantity, removeFromCart } = useCart();
  
  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1);
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(item.id, quantity - 1);
    }
  };
  
  const handleRemove = () => {
    removeFromCart(item.id);
  };
  
  const itemTotal = product.finalPrice * quantity;
  
  return (
    <div className="flex items-center py-4 border-b border-neutral-300">
      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="ml-4 flex-grow">
        <h4 className="font-medium">{product.name}</h4>
        <p className="text-secondary text-sm">Size: {size} | Color: {color}</p>
        <div className="flex items-center mt-2">
          <Button 
            variant="outline" 
            size="icon"
            className="h-6 w-6 text-secondary hover:text-accent border border-neutral-300 rounded p-0"
            onClick={handleDecrement}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="mx-3">{quantity}</span>
          <Button 
            variant="outline" 
            size="icon"
            className="h-6 w-6 text-secondary hover:text-accent border border-neutral-300 rounded p-0"
            onClick={handleIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
      <div className="ml-4 flex flex-col items-end">
        <span className="font-semibold">${itemTotal.toFixed(2)}</span>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-secondary hover:text-destructive mt-2 p-0 h-auto"
          onClick={handleRemove}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
