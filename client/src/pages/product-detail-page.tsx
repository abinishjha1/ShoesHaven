import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Product } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Truck,
  RotateCcw,
  Shield,
  Minus,
  Plus,
} from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Fetch product details
  const {
    data: product,
    isLoading,
    error,
  } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
  });
  
  // Set initial selected options when product data loads
  if (product && !selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }
  
  if (product && !selectedSize && product.sizes.length > 0) {
    setSelectedSize(product.sizes[0]);
  }
  
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
      setCurrentImageIndex((prev) =>
        prev === product.imageUrls.length - 1 ? 0 : prev + 1
      );
    }
  };
  
  const prevImage = () => {
    if (product) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? product.imageUrls.length - 1 : prev - 1
      );
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      productId: product.id,
      quantity,
      size: selectedSize,
      color: selectedColor,
      product,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };
  
  // Calculate discounted price
  const discountedPrice = product?.discountPercentage
    ? Number(product.price) * (1 - product.discountPercentage / 100)
    : null;
  
  // If error occurs
  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-12 container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-6">The product you are looking for does not exist or has been removed.</p>
            <Link href="/products/category/all">
              <Button>View All Products</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>
          {isLoading
            ? "Loading Product... | Footwear Fusion"
            : `${product?.name} | Footwear Fusion`}
        </title>
        <meta
          name="description"
          content={
            isLoading
              ? "Loading product details..."
              : product?.description || "Product details"
          }
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-12 bg-neutral-100">
          <div className="container mx-auto px-4">
            {/* Breadcrumbs */}
            <div className="flex items-center text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground">
                Home
              </Link>
              <ChevronRight className="h-4 w-4 mx-2" />
              {product ? (
                <>
                  <Link
                    href={`/products/category/${product.category}`}
                    className="hover:text-foreground capitalize"
                  >
                    {product.category}
                  </Link>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <span className="text-foreground">{product.name}</span>
                </>
              ) : (
                <Skeleton className="h-4 w-32" />
              )}
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Skeleton className="w-full h-[500px] rounded-lg" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="py-4">
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="py-4">
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="flex gap-4 py-4">
                    <Skeleton className="h-12 w-1/2" />
                    <Skeleton className="h-12 w-1/2" />
                  </div>
                </div>
              </div>
            ) : product ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="relative bg-white rounded-lg overflow-hidden h-[500px]">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentImageIndex}
                        src={product.imageUrls[currentImageIndex]}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    </AnimatePresence>
                    
                    {product.imageUrls.length > 1 && (
                      <>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full opacity-70 hover:opacity-100"
                          onClick={prevImage}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full opacity-70 hover:opacity-100"
                          onClick={nextImage}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnail Images */}
                  {product.imageUrls.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {product.imageUrls.map((url, index) => (
                        <button
                          key={index}
                          className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                            index === currentImageIndex
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        >
                          <img
                            src={url}
                            alt={`${product.name} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Product Details */}
                <div>
                  <h1 className="text-3xl font-bold font-montserrat mb-2">{product.name}</h1>
                  
                  {/* Price */}
                  <div className="mb-4">
                    {discountedPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold">
                          {formatCurrency(discountedPrice)}
                        </span>
                        <span className="text-muted-foreground line-through">
                          {formatCurrency(Number(product.price))}
                        </span>
                        <span className="bg-green-500 text-white px-2 py-0.5 text-xs rounded-full">
                          {product.discountPercentage}% OFF
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-semibold">
                        {formatCurrency(Number(product.price))}
                      </span>
                    )}
                  </div>
                  
                  {/* Ratings */}
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      <Star className="h-5 w-5 fill-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400" />
                      <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-400" />
                    </div>
                    <span className="text-sm text-muted-foreground ml-2">
                      (42 Reviews)
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-muted-foreground mb-6">{product.description}</p>
                  
                  {/* Product Options */}
                  <div className="space-y-6">
                    {/* Color Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Color: <span className="font-semibold">{selectedColor}</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color}
                            className={`border-2 rounded-full p-1 ${
                              selectedColor === color
                                ? "border-primary"
                                : "border-transparent"
                            }`}
                            onClick={() => setSelectedColor(color)}
                          >
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{ backgroundColor: color.toLowerCase() }}
                              title={color}
                            ></div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Size Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2" htmlFor="size-select">
                        Size
                      </label>
                      <Select value={selectedSize} onValueChange={setSelectedSize}>
                        <SelectTrigger id="size-select" className="w-full">
                          <SelectValue placeholder="Select size" />
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
                    
                    {/* Quantity Selection */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Quantity
                      </label>
                      <div className="flex items-center border rounded-md w-36">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 rounded-none"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 text-center">{quantity}</div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 rounded-none"
                          onClick={incrementQuantity}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-2">
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90"
                        size="lg"
                        onClick={handleAddToCart}
                      >
                        Add to Cart
                      </Button>
                      <Button
                        className="flex-1 bg-accent hover:bg-accent/90"
                        size="lg"
                        onClick={handleBuyNow}
                      >
                        Buy Now
                      </Button>
                    </div>
                    
                    {/* Product Policies */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                      <div className="flex items-center">
                        <Truck className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="text-sm">Free shipping over $50</span>
                      </div>
                      <div className="flex items-center">
                        <RotateCcw className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="text-sm">30-day easy returns</span>
                      </div>
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span className="text-sm">2-year warranty</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
            
            {/* Product Details Tabs */}
            {product && (
              <div className="mt-12">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 max-w-md">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  <div className="mt-6 bg-white p-6 rounded-lg">
                    <TabsContent value="description">
                      <h2 className="text-xl font-semibold mb-4">Product Description</h2>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {product.description}
                        {/* Extended description for demo purposes */}
                        {"\n\n"}
                        Experience unparalleled comfort and style with our premium quality footwear. Each pair is crafted with attention to detail, using high-quality materials that ensure durability and comfort for everyday wear.
                        {"\n\n"}
                        Whether you're looking for casual everyday shoes, athletic performance footwear, or elegant formal options, our {product.name} is designed to meet your needs while keeping you at the forefront of fashion.
                      </p>
                    </TabsContent>
                    <TabsContent value="specifications">
                      <h2 className="text-xl font-semibold mb-4">Product Specifications</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border-b pb-2">
                          <span className="font-medium">Category:</span>{" "}
                          <span className="text-muted-foreground capitalize">{product.category}</span>
                        </div>
                        <div className="border-b pb-2">
                          <span className="font-medium">Available Colors:</span>{" "}
                          <span className="text-muted-foreground">
                            {product.colors.join(", ")}
                          </span>
                        </div>
                        <div className="border-b pb-2">
                          <span className="font-medium">Available Sizes:</span>{" "}
                          <span className="text-muted-foreground">
                            {product.sizes.join(", ")}
                          </span>
                        </div>
                        <div className="border-b pb-2">
                          <span className="font-medium">Material:</span>{" "}
                          <span className="text-muted-foreground">
                            Premium Synthetic/Textile
                          </span>
                        </div>
                        <div className="border-b pb-2">
                          <span className="font-medium">Sole:</span>{" "}
                          <span className="text-muted-foreground">
                            Rubber
                          </span>
                        </div>
                        <div className="border-b pb-2">
                          <span className="font-medium">Closure:</span>{" "}
                          <span className="text-muted-foreground">
                            Lace-up
                          </span>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="reviews">
                      <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>
                      <div className="space-y-6">
                        <div className="border-b pb-4">
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400" />
                            </div>
                            <span className="ml-2 font-medium">Sarah Johnson</span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              2 months ago
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            The quality of these shoes exceeded my expectations. Very comfortable and stylish. I will definitely be purchasing more from this store!
                          </p>
                        </div>
                        <div className="border-b pb-4">
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4" />
                            </div>
                            <span className="ml-2 font-medium">Michael Rodriguez</span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              1 month ago
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            Great product for the price. Sizing is accurate and they look exactly as pictured. Would have given 5 stars but delivery took a bit longer than expected.
                          </p>
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            <div className="flex text-yellow-400">
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400" />
                              <Star className="h-4 w-4 fill-yellow-400 stroke-yellow-400" />
                            </div>
                            <span className="ml-2 font-medium">Emily Thompson</span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              2 weeks ago
                            </span>
                          </div>
                          <p className="text-muted-foreground">
                            These are the most comfortable shoes I've ever owned! They fit perfectly and look even better in person. Customer service was excellent when I had questions about sizing.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;
