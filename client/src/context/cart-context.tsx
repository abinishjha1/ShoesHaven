import { createContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CartItem, Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface CartItemWithProduct extends CartItem {
  product: Product;
}

interface CartContextValue {
  cartItems: CartItemWithProduct[];
  addToCart: (item: Omit<CartItem, "id" | "userId" | "createdAt"> & { product: Product }) => void;
  updateCartItem: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  error: Error | null;
}

export const CartContext = createContext<CartContextValue | null>(null);

// Import useAuth at runtime to avoid circular dependency
import { useAuth } from "@/hooks/use-auth";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
  
  // Fetch cart items from API if user is logged in
  const {
    data: serverCartItems,
    isLoading,
    error,
    refetch,
  } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    enabled: !!user, // Only fetch if user is logged in
  });
  
  // Update cart items when server data changes
  useEffect(() => {
    if (serverCartItems) {
      setCartItems(serverCartItems);
    }
  }, [serverCartItems]);
  
  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (item: Omit<CartItem, "id" | "userId" | "createdAt">) => {
      const res = await apiRequest("POST", "/api/cart", item);
      return await res.json() as CartItemWithProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update cart item mutation
  const updateCartItemMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const res = await apiRequest("PUT", `/api/cart/${id}`, { quantity });
      return await res.json() as CartItemWithProduct;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error removing from cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/cart`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error clearing cart",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Add item to cart
  const addToCart = (item: Omit<CartItem, "id" | "userId" | "createdAt"> & { product: Product }) => {
    if (user) {
      // If user is logged in, use the API
      const { product, ...cartItemData } = item;
      addToCartMutation.mutate(cartItemData);
    } else {
      // For demo purposes, handle guest cart locally
      // In a real app, you would store this in localStorage
      const existingItemIndex = cartItems.findIndex(
        (cartItem) => 
          cartItem.productId === item.productId && 
          cartItem.color === item.color && 
          cartItem.size === item.size
      );
      
      if (existingItemIndex !== -1) {
        // If item already exists in cart, update quantity
        const updatedCartItems = [...cartItems];
        updatedCartItems[existingItemIndex].quantity += item.quantity;
        setCartItems(updatedCartItems);
      } else {
        // Otherwise, add new item
        const newItem: CartItemWithProduct = {
          id: Date.now(), // Temporary ID for local cart
          userId: 0, // Temporary userId for local cart
          createdAt: new Date(),
          ...item,
        };
        setCartItems((prev) => [...prev, newItem]);
      }
    }
  };
  
  // Update cart item quantity
  const updateCartItem = (id: number, quantity: number) => {
    if (user) {
      // If user is logged in, use the API
      updateCartItemMutation.mutate({ id, quantity });
    } else {
      // For guest cart
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };
  
  // Remove item from cart
  const removeFromCart = (id: number) => {
    if (user) {
      // If user is logged in, use the API
      removeFromCartMutation.mutate(id);
    } else {
      // For guest cart
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    }
  };
  
  // Clear cart
  const clearCart = () => {
    if (user) {
      // If user is logged in, use the API
      clearCartMutation.mutate();
    } else {
      // For guest cart
      setCartItems([]);
    }
  };
  
  // Refetch cart when user logs in
  useEffect(() => {
    if (user) {
      refetch();
    } else {
      // Clear server cart items when user logs out
      setCartItems([]);
    }
  }, [user, refetch]);
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
        isLoading,
        error,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
