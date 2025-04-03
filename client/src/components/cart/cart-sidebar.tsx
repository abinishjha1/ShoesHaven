import { useRef, useEffect } from "react";
import { X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { CartItem } from "@/components/ui/cart-item";
import { Link } from "wouter";

export function CartSidebar() {
  const { isOpen, cartItems, toggleCart, cartTotal } = useCart();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Close cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        toggleCart();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleCart]);
  
  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);
  
  const sidebar = {
    hidden: { x: "100%" },
    visible: { 
      x: 0,
      transition: { type: "tween", duration: 0.3 }
    },
    exit: { 
      x: "100%",
      transition: { type: "tween", duration: 0.3 }
    }
  };
  
  const overlay = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlay}
          />
          
          <motion.div
            ref={sidebarRef}
            className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-xl z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebar}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b border-neutral-300 flex justify-between items-center">
                <h3 className="text-xl font-heading font-bold">
                  Your Cart ({totalItems})
                </h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleCart}
                  className="text-secondary hover:text-primary"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {cartItems.length === 0 ? (
                <div className="flex-grow flex flex-col items-center justify-center p-4">
                  <ShoppingBag className="h-16 w-16 text-neutral-300 mb-4" />
                  <p className="text-lg font-medium mb-2">Your cart is empty</p>
                  <p className="text-secondary text-center mb-6">Looks like you haven't added any items to your cart yet.</p>
                  <Button 
                    onClick={toggleCart}
                    className="bg-primary hover:bg-accent text-white"
                  >
                    Continue Shopping
                  </Button>
                </div>
              ) : (
                <>
                  <div className="flex-grow overflow-y-auto p-4">
                    {cartItems.map((item) => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                  
                  <div className="p-4 border-t border-neutral-300">
                    <div className="flex justify-between mb-4">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4 text-sm text-secondary">
                      <span>Shipping</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <Link href="/checkout">
                      <Button 
                        className="w-full bg-accent hover:bg-opacity-90 text-white font-medium py-3 px-4 rounded-md mb-3 transition-colors"
                        onClick={toggleCart}
                      >
                        Checkout
                      </Button>
                    </Link>
                    <Button 
                      variant="outline"
                      className="w-full bg-primary hover:bg-opacity-90 text-white font-medium py-3 px-4 rounded-md transition-colors"
                      onClick={toggleCart}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
