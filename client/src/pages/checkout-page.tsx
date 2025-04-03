import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CreditCard, MapPin, Loader2 } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";

const shippingFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  address1: z.string().min(5, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  country: z.string().min(2, "Country is required"),
});

const paymentFormSchema = z.object({
  cardName: z.string().min(2, "Name on card is required"),
  cardNumber: z.string().min(16, "Card number is required"),
  expiryMonth: z.string().min(1, "Month is required"),
  expiryYear: z.string().min(4, "Year is required"),
  cvv: z.string().min(3, "CVV is required"),
  saveCard: z.boolean().optional(),
});

const deliverySchema = z.object({
  method: z.enum(["standard", "express"]),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;
type PaymentFormValues = z.infer<typeof paymentFormSchema>;
type DeliveryValues = z.infer<typeof deliverySchema>;

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeStep, setActiveStep] = useState("shipping");
  
  // Form setup
  const shippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      country: "US",
    },
  });
  
  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      saveCard: false,
    },
  });
  
  const deliveryForm = useForm<DeliveryValues>({
    resolver: zodResolver(deliverySchema),
    defaultValues: {
      method: "standard",
    },
  });
  
  // Place order mutation
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const res = await apiRequest("POST", "/api/orders", orderData);
      return await res.json();
    },
    onSuccess: () => {
      clearCart();
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase.",
      });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Form submissions
  const onShippingSubmit = (data: ShippingFormValues) => {
    // Move to next step
    setActiveStep("delivery");
    
    // Build shipping address string
    const shippingAddress = `${data.firstName} ${data.lastName}, ${data.address1}, ${
      data.address2 ? data.address2 + ", " : ""
    }${data.city}, ${data.state} ${data.zipCode}, ${data.country}`;
    
    // Store for later use
    sessionStorage.setItem("shippingAddress", shippingAddress);
    sessionStorage.setItem("contactEmail", data.email);
    sessionStorage.setItem("contactPhone", data.phone);
  };
  
  const onDeliverySubmit = (data: DeliveryValues) => {
    // Move to next step
    setActiveStep("payment");
    
    // Store for later use
    sessionStorage.setItem("deliveryMethod", data.method);
  };
  
  const onPaymentSubmit = (data: PaymentFormValues) => {
    // Prepare order items
    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.product.price,
      color: item.color,
      size: item.size,
    }));
    
    // Get stored data
    const shippingAddress = sessionStorage.getItem("shippingAddress") || "";
    
    // Place order
    placeOrderMutation.mutate({
      shippingAddress,
      orderItems,
      totalAmount: orderTotal,
    });
  };
  
  // Calculate order summary
  const shipping = cartTotal > 50 ? 0 : 10;
  const deliveryMethod = deliveryForm.watch("method");
  const expressDeliveryFee = deliveryMethod === "express" ? 15 : 0;
  const tax = cartTotal * 0.08; // 8% tax
  const orderTotal = cartTotal + shipping + expressDeliveryFee + tax;
  
  // Check if cart is empty and redirect
  if (cartItems.length === 0 && !placeOrderMutation.isPending) {
    toast({
      title: "Your cart is empty",
      description: "Add some items to your cart before checking out.",
    });
    navigate("/");
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Checkout | Footwear Fusion</title>
        <meta
          name="description"
          content="Complete your purchase at Footwear Fusion. Safe and secure checkout."
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-12 bg-neutral-100">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold font-montserrat mb-8">Checkout</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Checkout Steps */}
              <div className="lg:col-span-2">
                <Tabs value={activeStep} onValueChange={setActiveStep} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="shipping" disabled={activeStep !== "shipping"}>
                      1. Shipping
                    </TabsTrigger>
                    <TabsTrigger value="delivery" disabled={activeStep !== "delivery" && activeStep !== "shipping"}>
                      2. Delivery
                    </TabsTrigger>
                    <TabsTrigger value="payment" disabled={activeStep === "shipping"}>
                      3. Payment
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Shipping Information */}
                  <TabsContent value="shipping">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-6">
                          <MapPin className="h-5 w-5 text-primary" />
                          <h2 className="text-xl font-semibold">Shipping Information</h2>
                        </div>
                        
                        <Form {...shippingForm}>
                          <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={shippingForm.control}
                                name="firstName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>First Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="John" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={shippingForm.control}
                                name="lastName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Last Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Doe" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={shippingForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input placeholder="john.doe@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={shippingForm.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                      <Input placeholder="(123) 456-7890" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={shippingForm.control}
                              name="address1"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address Line 1</FormLabel>
                                  <FormControl>
                                    <Input placeholder="123 Main St" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={shippingForm.control}
                              name="address2"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Address Line 2 (Optional)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Apt 4B" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={shippingForm.control}
                                name="city"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>City</FormLabel>
                                    <FormControl>
                                      <Input placeholder="New York" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={shippingForm.control}
                                name="state"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>State</FormLabel>
                                    <FormControl>
                                      <Input placeholder="NY" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={shippingForm.control}
                                name="zipCode"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Zip Code</FormLabel>
                                    <FormControl>
                                      <Input placeholder="10001" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={shippingForm.control}
                                name="country"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Country</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="US">United States</SelectItem>
                                        <SelectItem value="CA">Canada</SelectItem>
                                        <SelectItem value="UK">United Kingdom</SelectItem>
                                        <SelectItem value="AU">Australia</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="pt-4">
                              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                                Continue to Delivery
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Delivery Options */}
                  <TabsContent value="delivery">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-6">
                          <Loader2 className="h-5 w-5 text-primary" />
                          <h2 className="text-xl font-semibold">Delivery Method</h2>
                        </div>
                        
                        <Form {...deliveryForm}>
                          <form onSubmit={deliveryForm.handleSubmit(onDeliverySubmit)} className="space-y-6">
                            <FormField
                              control={deliveryForm.control}
                              name="method"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <RadioGroup
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      className="flex flex-col space-y-4"
                                    >
                                      <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-muted">
                                        <RadioGroupItem value="standard" id="standard" />
                                        <div className="flex-1">
                                          <label htmlFor="standard" className="flex items-center justify-between cursor-pointer">
                                            <div>
                                              <p className="font-medium">Standard Delivery</p>
                                              <p className="text-sm text-muted-foreground">Delivery in 5-7 business days</p>
                                            </div>
                                            <div>
                                              {shipping === 0 ? "Free" : formatCurrency(shipping)}
                                            </div>
                                          </label>
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-muted">
                                        <RadioGroupItem value="express" id="express" />
                                        <div className="flex-1">
                                          <label htmlFor="express" className="flex items-center justify-between cursor-pointer">
                                            <div>
                                              <p className="font-medium">Express Delivery</p>
                                              <p className="text-sm text-muted-foreground">Delivery in 1-3 business days</p>
                                            </div>
                                            <div>
                                              {formatCurrency(15)}
                                            </div>
                                          </label>
                                        </div>
                                      </div>
                                    </RadioGroup>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-between pt-4">
                              <Button type="button" variant="outline" onClick={() => setActiveStep("shipping")}>
                                Back to Shipping
                              </Button>
                              <Button type="submit" className="bg-primary hover:bg-primary/90">
                                Continue to Payment
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Payment Information */}
                  <TabsContent value="payment">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-6">
                          <CreditCard className="h-5 w-5 text-primary" />
                          <h2 className="text-xl font-semibold">Payment Information</h2>
                        </div>
                        
                        <Form {...paymentForm}>
                          <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-4">
                            <FormField
                              control={paymentForm.control}
                              name="cardName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Name on Card</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={paymentForm.control}
                              name="cardNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Card Number</FormLabel>
                                  <FormControl>
                                    <Input placeholder="1234 5678 9012 3456" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-3 gap-4">
                              <FormField
                                control={paymentForm.control}
                                name="expiryMonth"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Month</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="MM" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                                          <SelectItem
                                            key={month}
                                            value={month.toString().padStart(2, "0")}
                                          >
                                            {month.toString().padStart(2, "0")}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={paymentForm.control}
                                name="expiryYear"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Year</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="YYYY" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {Array.from(
                                          { length: 10 },
                                          (_, i) => new Date().getFullYear() + i
                                        ).map((year) => (
                                          <SelectItem key={year} value={year.toString()}>
                                            {year}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={paymentForm.control}
                                name="cvv"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>CVV</FormLabel>
                                    <FormControl>
                                      <Input placeholder="123" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="flex justify-between pt-4">
                              <Button type="button" variant="outline" onClick={() => setActiveStep("delivery")}>
                                Back to Delivery
                              </Button>
                              <Button 
                                type="submit" 
                                className="bg-accent hover:bg-accent/90"
                                disabled={placeOrderMutation.isPending}
                              >
                                {placeOrderMutation.isPending ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  "Place Order"
                                )}
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              
              {/* Order Summary */}
              <div>
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    
                    {/* Products */}
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div
                          key={`${item.id}-${item.color}-${item.size}`}
                          className="flex gap-3"
                        >
                          <div className="w-16 h-16 bg-white rounded overflow-hidden">
                            <img
                              src={item.product.imageUrls[0]}
                              alt={item.product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.color} / {item.size} / Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-medium">
                              {formatCurrency(Number(item.product.price) * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Summary Calculations */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>{formatCurrency(cartTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                      </div>
                      {deliveryMethod === "express" && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Express Delivery</span>
                          <span>{formatCurrency(expressDeliveryFee)}</span>
                        </div>
                      )}
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
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default CheckoutPage;
