import { Link } from "wouter";
import { ProductWithDetails } from "@shared/schema";
import { useState } from "react";
import { Heart, ShoppingCart, Star, StarHalf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";

type ProductCardProps = {
  product: ProductWithDetails;
  className?: string;
};

export function ProductCard({ product, className = "" }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0],
    });
    
    toast({
      title: "Item added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  return (
    <div 
      className={`product-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden h-64">
        <Link href={`/product/${product.id}`}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className={`w-full h-full object-cover transition-transform duration-300 ${isHovered ? 'scale-105' : ''}`}
          />
        </Link>
        <div className="absolute top-3 right-3">
          <Button variant="secondary" size="icon" className="bg-white rounded-full shadow-sm">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
        {product.newArrival && (
          <div className="absolute top-3 left-3">
            <span className="bg-accent text-white text-sm px-2 py-1 rounded">New</span>
          </div>
        )}
        {product.discountPercentage > 0 && (
          <div className="absolute top-3 left-3">
            <span className="bg-green-500 text-white text-sm px-2 py-1 rounded">Sale</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-secondary text-sm">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
            <Link href={`/product/${product.id}`}>
              <h3 className="text-lg font-medium hover:text-accent transition-colors">{product.name}</h3>
            </Link>
          </div>
          <div>
            {product.discountPercentage > 0 ? (
              <div>
                <span className="font-semibold text-lg">${product.finalPrice.toFixed(2)}</span>
                <span className="text-secondary line-through text-sm ml-1">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <div className="font-semibold text-lg">${product.price.toFixed(2)}</div>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <div className="flex text-accent">
              {[...Array(5)].map((_, i) => {
                const rating = 4.5; // Example rating
                return i < Math.floor(rating) ? (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ) : i < Math.ceil(rating) ? (
                  <StarHalf key={i} className="h-4 w-4 fill-current" />
                ) : (
                  <Star key={i} className="h-4 w-4" />
                );
              })}
            </div>
            <span className="text-secondary text-sm ml-1">(42)</span>
          </div>
          <Button 
            variant="default" 
            size="icon" 
            className="bg-primary hover:bg-accent text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
