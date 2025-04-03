import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import { formatCurrency } from "@/lib/utils";

const NewArrivals = () => {
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products/new-arrivals"],
  });

  if (error) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Error loading new arrivals.</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-montserrat font-bold text-3xl mb-12 text-center">
          New Arrivals
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-neutral-100 rounded-lg overflow-hidden"
                >
                  <Skeleton className="w-full h-80" />
                </div>
              ))
            : products?.slice(0, 3).map((product, index) => (
                <NewArrivalCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

interface NewArrivalCardProps {
  product: Product;
  index: number;
}

const NewArrivalCard = ({ product, index }: NewArrivalCardProps) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    // Default to first available size and color
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0];
    
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
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-neutral-100 rounded-lg overflow-hidden"
    >
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-80 object-cover"
          />
        </Link>
        <div className="absolute top-4 right-4">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full bg-white text-primary shadow hover:bg-neutral-100"
          >
            <Heart className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium text-lg text-white">{product.name}</h3>
          </Link>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-white">
              {formatCurrency(Number(product.price))}
            </span>
            <Button
              onClick={handleAddToCart}
              className="bg-accent hover:bg-opacity-90 text-white text-sm py-1 px-3 rounded-full"
            >
              Add to cart
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewArrivals;
