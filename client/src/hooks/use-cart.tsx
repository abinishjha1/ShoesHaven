import { useContext } from "react";
import { CartContext, CartItemWithProduct } from "../context/cart-context";

export function useCart() {
  const context = useContext(CartContext);
  
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  const {
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    isLoading,
    error
  } = context;
  
  // Calculate cart total
  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.product.price) * item.quantity,
    0
  );
  
  // Calculate number of items in cart
  const cartItemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );
  
  // Increment item quantity
  const incrementQuantity = (itemId: number) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      updateCartItem(itemId, item.quantity + 1);
    }
  };
  
  // Decrement item quantity
  const decrementQuantity = (itemId: number) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      updateCartItem(itemId, item.quantity - 1);
    } else if (item && item.quantity === 1) {
      removeFromCart(itemId);
    }
  };
  
  return {
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    incrementQuantity,
    decrementQuantity,
    cartTotal,
    cartItemCount,
    isLoading,
    error
  };
}
