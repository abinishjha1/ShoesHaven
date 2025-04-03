import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ProductWithDetails } from "@shared/schema";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronLeft, 
  ChevronRight, 
  Minus, 
  Plus, 
  ShoppingCart, 
  Heart, 
  Truck, 
  RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function ProductPage() {
  const [, params] = useRoute<{ id: string }>("/product/:id");
  const productId = parseInt(params?.id || "0");
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Product query
  const { data: product, isLoading } = useQuery<ProductWithDetails>({
    queryKey: [`/api/products/${productId}`],
    enabled: productId > 0,
  });
  
  // State for product options
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Set default values when product loads
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
      document.title = `${product.name} - FootwearFusion`;
    }
  }, [product]);
  
  // Handle quantity changes
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };
  
  // Handle image navigation
  const nextImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };
  
  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product || !selectedSize || !selectedColor) {
      toast({
        title: "Please select options",
        description: "Please select size and color before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      productId: product.id,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist",
      description: "This product has been added to your wishlist",
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-12 bg-neutral-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <Skeleton className="w-full h-[500px]" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-8 w-1/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
        <CartSidebar />
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-12 bg-neutral-100">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-heading font-bold mb-4">Product Not Found</h1>
            <p>The product you are looking for does not exist or has been removed.</p>
          </div>
        </main>
        <Footer />
        <CartSidebar />
      </div>
    );
  }
  
  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Product Images */}
            <div className="relative">
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative h-[500px]">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        index === currentImageIndex ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ))}
                </div>
                
                {/* Image Navigation */}
                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-neutral-100 rounded-full shadow-md"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-neutral-100 rounded-full shadow-md"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </>
                )}
                
                {/* Image Indicators */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {product.images.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full ${
                          index === currentImageIndex ? "bg-accent" : "bg-neutral-300"
                        }`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 mt-4">
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                        index === currentImageIndex ? "border-accent" : "border-transparent"
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-20 object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <p className="text-accent font-medium mb-2">
                  {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </p>
                <h1 className="text-3xl font-heading font-bold">{product.name}</h1>
              </div>
              
              <div className="flex items-center">
                <div className="flex text-accent">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>
                <span className="text-secondary ml-2">(42 reviews)</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {product.discountPercentage > 0 ? (
                  <>
                    <span className="text-2xl font-bold">${discountedPrice.toFixed(2)}</span>
                    <span className="text-lg text-secondary line-through">${product.price.toFixed(2)}</span>
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">
                      {product.discountPercentage}% OFF
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                )}
              </div>
              
              <div>
                <p className="text-secondary mb-4">{product.description}</p>
              </div>
              
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex gap-3">
                  {product.colors.map((color) => (
                    <div className="flex items-center space-x-2" key={color}>
                      <RadioGroupItem value={color} id={`color-${color}`} />
                      <Label htmlFor={`color-${color}`}>{color}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="mx-4 text-lg w-10 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  
                  <span className="ml-4 text-secondary">
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>
              
              {/* Add to Cart & Wishlist */}
              <div className="flex items-center space-x-4">
                <Button
                  className="flex-grow bg-accent hover:bg-accent/90 text-white"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-12 h-12 p-0"
                  onClick={handleAddToWishlist}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Shipping & Returns */}
              <div className="border-t border-neutral-200 pt-6 grid gap-4">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 mt-1 mr-2 text-accent" />
                  <div>
                    <h3 className="font-medium">Free Shipping</h3>
                    <p className="text-sm text-secondary">Free standard shipping on orders over $50</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <RefreshCw className="h-5 w-5 mt-1 mr-2 text-accent" />
                  <div>
                    <h3 className="font-medium">Easy Returns</h3>
                    <p className="text-sm text-secondary">30-day return policy. See our return policy for details.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Product Details Tabs */}
          <div className="mt-16">
            <div className="border-b border-neutral-300">
              <nav className="flex -mb-px">
                <button className="py-4 px-6 border-b-2 border-accent text-accent font-medium">
                  Product Details
                </button>
                <button className="py-4 px-6 border-b-2 border-transparent text-secondary hover:text-accent">
                  Reviews
                </button>
                <button className="py-4 px-6 border-b-2 border-transparent text-secondary hover:text-accent">
                  Shipping & Returns
                </button>
              </nav>
            </div>
            <div className="py-8">
              <div className="prose max-w-none">
                <h2>Product Details</h2>
                <p>
                  {product.description}
                </p>
                <ul>
                  <li>Category: {product.category}</li>
                  <li>Available Sizes: {product.sizes.join(", ")}</li>
                  <li>Available Colors: {product.colors.join(", ")}</li>
                  {product.featured && <li>Featured Product</li>}
                  {product.newArrival && <li>New Arrival</li>}
                </ul>
                <p>
                  Experience exceptional comfort and style with our premium quality footwear.
                  Designed with your comfort in mind, these shoes feature durable materials
                  and expert craftsmanship for lasting performance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
