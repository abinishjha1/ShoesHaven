import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Product } from "@shared/schema";
import ProductCard from "../products/product-card";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProducts = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 4;

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });

  if (error) {
    return (
      <div className="py-16 bg-neutral-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">Error loading featured products.</p>
        </div>
      </div>
    );
  }

  const totalPages = products ? Math.ceil(products.length / productsPerPage) : 0;
  const displayedProducts = products
    ? products.slice(
        currentPage * productsPerPage,
        (currentPage + 1) * productsPerPage
      )
    : [];

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-16 bg-neutral-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="font-montserrat font-bold text-3xl">
            Featured Products
          </h2>
          {!isLoading && products && products.length > productsPerPage && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={goToPrevPage}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={goToNextPage}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
                  <div className="relative">
                    <Skeleton className="w-full h-64" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-9 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              ))
            : displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link href="/products/category/all">
            <Button className="bg-accent hover:bg-opacity-90 text-white font-semibold py-3 px-8 rounded-full">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
