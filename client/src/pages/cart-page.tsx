import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation } from "wouter";
import { Trash, ChevronRight, ShoppingCart, Loader2 } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

const CartPage = () => {
  const { cartItems, removeFromCart, incrementQuantity, decrementQuantity, cartTotal, isLoading } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  
  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplyingPromo(true);
    
    // Simulate API call for promo code
    setTimeout(() => {
      toast({
        title: "Invalid promo code",
        description: "The promo code you entered is invalid or expired.",
        variant: "destructive",
      });
      setIsApplyingPromo(false);
    }, 1000);
  };
  
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add some items to your cart before checking out.",
        variant: "destructive",
      });
      return;
    }
    
    navigate("/checkout");
  };
  
  // Calculate cart summary
  const shipping = cartTotal > 50 ? 0 : 10;
  const tax = cartTotal * 0.08; // 8% tax
  const orderTotal = cartTotal + shipping + tax;
  
  return (
    <>
      <Helmet>
        <title>Your Cart | Footwear Fusion</title>
        <meta
          name="description"
          content="View and manage items in your shopping cart at Footwear Fusion."
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-12 bg-neutral-100">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold font-montserrat mb-8">Your Cart</h1>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex justify-center items-center w-20 h-20 rounded-full bg-muted mb-6">
                  <ShoppingCart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Link href="/products/category/all">
                  <Button className="bg-primary hover:bg-primary/90">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <Card key={`${item.id}-${item.color}-${item.size}`} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col sm:flex-row">
                          {/* Product Image */}
                          <div className="w-full sm:w-32 h-32 bg-white overflow-hidden">
                            <img
                              src={item.product.imageUrls[0]}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="flex-1 p-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between">
                              <div>
                                <h3 className="font-medium">
                                  <Link href={`/products/${item.product.id}`} className="hover:underline">
                                    {item.product.name}
                                  </Link>
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  Size: {item.size} | Color: {item.color}
                                </p>
                                <p className="text-sm font-medium mt-2">
                                  {formatCurrency(Number(item.product.price))}
                                </p>
                              </div>
                              
                              <div className="flex items-center mt-4 sm:mt-0">
                                <div className="flex items-center border rounded-full">
                                  <button
                                    className="px-3 py-1 text-secondary hover:text-primary"
                                    onClick={() => decrementQuantity(item.id)}
                                    disabled={item.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="px-3">{item.quantity}</span>
                                  <button
                                    className="px-3 py-1 text-secondary hover:text-primary"
                                    onClick={() => incrementQuantity(item.id)}
                                  >
                                    +
                                  </button>
                                </div>
                                
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="ml-2 text-muted-foreground hover:text-destructive"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-2 sm:text-right">
                              <p className="font-semibold">
                                {formatCurrency(Number(item.product.price) * item.quantity)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div>
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>{formatCurrency(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping</span>
                          <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax (8%)</span>
                          <span>{formatCurrency(tax)}</span>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="flex justify-between text-lg font-semibold">
                          <span>Order Total</span>
                          <span>{formatCurrency(orderTotal)}</span>
                        </div>
                      </div>
                      
                      {/* Promo Code */}
                      <div className="mt-6">
                        <form onSubmit={handleApplyPromo} className="flex gap-2">
                          <Input
                            type="text"
                            placeholder="Promo code"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            type="submit"
                            variant="outline"
                            disabled={!promoCode || isApplyingPromo}
                          >
                            {isApplyingPromo ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-1" />
                            ) : null}
                            Apply
                          </Button>
                        </form>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex flex-col gap-4">
                      <Button
                        className="w-full bg-accent hover:bg-accent/90"
                        size="lg"
                        onClick={handleProceedToCheckout}
                      >
                        Proceed to Checkout
                      </Button>
                      <Link href="/products/category/all" className="w-full">
                        <Button
                          variant="outline"
                          className="w-full"
                        >
                          Continue Shopping
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default CartPage;
