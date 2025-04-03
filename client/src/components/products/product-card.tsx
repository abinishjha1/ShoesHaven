import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Heart, Star, ShoppingBag, Eye } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAddingToCart(true);
    
    // Default to first available size and color
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0];
    
    setTimeout(() => {
      addToCart({
        productId: product.id,
        quantity: 1,
        size: defaultSize,
        color: defaultColor,
        product
      });
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
      
      setIsAddingToCart(false);
    }, 500);
  };

  const discountedPrice = product.discountPercentage
    ? Number(product.price) * (1 - product.discountPercentage / 100)
    : null;

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="relative group">
        <Link href={`/products/${product.id}`}>
          <div className="overflow-hidden">
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="w-full h-64 object-cover transform transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        </Link>
        
        {/* Quick action buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300">
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/90 backdrop-blur-sm text-primary shadow-md hover:bg-white transition-all"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/90 backdrop-blur-sm text-primary shadow-md hover:bg-white transition-all"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleAddToCart}
              variant="secondary"
              size="icon"
              className={`rounded-full shadow-md transition-all ${
                isAddingToCart 
                  ? "bg-green-500 text-white hover:bg-green-600" 
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
              disabled={isAddingToCart}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.newArrival && (
            <Badge className="bg-accent/90 hover:bg-accent text-white font-medium px-2.5 py-0.5 shadow-md animate-fade-in">
              New Arrival
            </Badge>
          )}
          {product.discountPercentage > 0 && (
            <Badge className="bg-green-500/90 hover:bg-green-500 text-white font-medium px-2.5 py-0.5 shadow-md">
              {product.discountPercentage}% OFF
            </Badge>
          )}
          {product.inStock === false && (
            <Badge variant="destructive" className="font-medium px-2.5 py-0.5 shadow-md">
              Out of Stock
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-5">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-lg hover:text-primary transition-colors duration-200 truncate">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-sm text-muted-foreground font-medium capitalize">
            {product.category}
          </span>
          
          <div className="flex text-yellow-400">
            <Star className="h-4 w-4 fill-yellow-400" />
            <span className="text-muted-foreground text-xs ml-1 font-medium">(4.8)</span>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div>
            {discountedPrice ? (
              <div className="flex items-center">
                <span className="font-bold text-lg text-primary">
                  {formatCurrency(discountedPrice)}
                </span>
                <span className="line-through text-muted-foreground text-sm ml-2">
                  {formatCurrency(Number(product.price))}
                </span>
              </div>
            ) : (
              <span className="font-bold text-lg text-primary">
                {formatCurrency(Number(product.price))}
              </span>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            className={`rounded-full shadow-md font-medium ${
              isAddingToCart 
                ? "bg-green-500 hover:bg-green-600" 
                : "bg-primary hover:bg-primary/90"
            }`}
            size="sm"
            disabled={isAddingToCart}
          >
            {isAddingToCart ? "Added" : "Add"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
