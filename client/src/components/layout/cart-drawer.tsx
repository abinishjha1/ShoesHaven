import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const {
    cartItems,
    cartTotal,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
  } = useCart();
  const [, navigate] = useLocation();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    onClose();
  };

  // Calculate subtotal, shipping, and tax
  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 10;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          
          {/* Cart drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-full max-w-[420px] h-full bg-white shadow-lg z-50"
          >
            <div className="flex flex-col h-full">
              {/* Cart header */}
              <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
                <h3 className="font-montserrat font-semibold text-xl">
                  Your Cart <span className="text-accent">({cartItems.length})</span>
                </h3>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Cart items container */}
              <div className="flex-grow overflow-y-auto p-4">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <p className="text-lg mb-4">Your cart is empty</p>
                    <Button onClick={handleContinueShopping}>Start Shopping</Button>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div key={`${item.id}-${item.color}-${item.size}`} className="flex items-center pb-4 mb-4 border-b border-neutral-200">
                      <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.imageUrls[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h4 className="font-medium">{item.product.name}</h4>
                        <p className="text-sm text-secondary">
                          Size: {item.size} | Color: {item.color}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <div className="flex items-center border rounded-full">
                            <button
                              className="px-2 py-1 text-secondary hover:text-primary"
                              onClick={() => decrementQuantity(item.id)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2">{item.quantity}</span>
                            <button
                              className="px-2 py-1 text-secondary hover:text-primary"
                              onClick={() => incrementQuantity(item.id)}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <span className="font-semibold">
                            {formatCurrency(Number(item.product.price) * item.quantity)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-2 text-secondary hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
              
              {/* Cart footer */}
              {cartItems.length > 0 && (
                <div className="p-4 border-t border-neutral-200">
                  {/* Summary */}
                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-secondary">Subtotal</span>
                      <span className="font-medium">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Shipping</span>
                      <span className="font-medium">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary">Tax</span>
                      <span className="font-medium">{formatCurrency(tax)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                  
                  {/* Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-accent hover:bg-opacity-90 text-white"
                      onClick={handleCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleContinueShopping}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
