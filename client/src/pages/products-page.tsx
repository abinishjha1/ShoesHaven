import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Product } from "@shared/schema";
import { Loader2, FilterIcon, X } from "lucide-react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductGrid from "@/components/products/product-grid";
import ProductFilters, { FilterState } from "@/components/products/product-filters";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

const ProductsPage = () => {
  const { category } = useParams<{ category: string }>();
  const [, navigate] = useLocation();
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    priceRange: [0, 200],
    colors: [],
    sizes: [],
    categories: [],
  });
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Fetch products by category
  const {
    data: products,
    isLoading,
    error,
  } = useQuery<Product[]>({
    queryKey: ["/api/products/category", category],
    queryFn: async () => {
      const endpoint = category === "all" 
        ? "/api/products" 
        : `/api/products/category/${category}`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });
  
  // Set initial category filter based on URL param
  useEffect(() => {
    if (category && category !== "all") {
      setActiveFilters(prev => ({
        ...prev,
        categories: [category]
      }));
    } else {
      setActiveFilters(prev => ({
        ...prev,
        categories: []
      }));
    }
  }, [category]);
  
  // Apply filters to products
  const filteredProducts = products
    ? products.filter((product) => {
        const price = Number(product.price);
        const matchesPrice =
          price >= activeFilters.priceRange[0] &&
          price <= activeFilters.priceRange[1];
          
        const matchesColor =
          activeFilters.colors.length === 0 ||
          product.colors.some((color) =>
            activeFilters.colors.includes(color)
          );
          
        const matchesSize =
          activeFilters.sizes.length === 0 ||
          product.sizes.some((size) =>
            activeFilters.sizes.includes(size)
          );
          
        const matchesCategory =
          activeFilters.categories.length === 0 ||
          activeFilters.categories.includes(product.category);
          
        return matchesPrice && matchesColor && matchesSize && matchesCategory;
      })
    : [];
    
  // Sort products
  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return Number(a.price) - Number(b.price);
      case "price-desc":
        return Number(b.price) - Number(a.price);
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return b.featured ? 1 : -1; // Featured products first
    }
  });
  
  // Handle filter changes
  const handleFilterChange = (filters: FilterState) => {
    setActiveFilters(filters);
  };
  
  // Get category name for display
  const getCategoryDisplayName = () => {
    if (category === "all") return "All Products";
    return `${category.charAt(0).toUpperCase() + category.slice(1)}'s Shoes`;
  };
  
  return (
    <>
      <Helmet>
        <title>{getCategoryDisplayName()} | Footwear Fusion</title>
        <meta
          name="description"
          content={`Shop our collection of ${category} shoes and footwear at Footwear Fusion.`}
        />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow py-8 bg-neutral-100">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold font-montserrat mb-2">
                {getCategoryDisplayName()}
              </h1>
              <p className="text-muted-foreground">
                {isLoading
                  ? "Loading products..."
                  : error
                  ? "Error loading products"
                  : `${sortedProducts.length} products available`}
              </p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Desktop Filters */}
              <div className="hidden lg:block w-64 bg-white p-6 rounded-lg shadow-sm h-fit">
                <h2 className="text-lg font-medium mb-4">Filters</h2>
                <ProductFilters onFilterChange={handleFilterChange} />
              </div>
              
              {/* Mobile Filters Button */}
              <div className="lg:hidden flex justify-between items-center mb-4">
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <FilterIcon className="h-4 w-4" />
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                    <SheetHeader>
                      <SheetTitle className="flex justify-between items-center">
                        Filters
                        <SheetClose asChild>
                          <Button variant="ghost" size="icon">
                            <X className="h-4 w-4" />
                          </Button>
                        </SheetClose>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                      <ProductFilters onFilterChange={handleFilterChange} />
                    </div>
                  </SheetContent>
                </Sheet>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {/* Products Section */}
              <div className="flex-1">
                {/* Desktop Sort Controls */}
                <div className="hidden lg:flex justify-end mb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Sort by:</span>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="featured">Featured</SelectItem>
                        <SelectItem value="price-asc">Price: Low to High</SelectItem>
                        <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        <SelectItem value="newest">Newest First</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Products Grid */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <ProductGrid
                    products={sortedProducts}
                    isLoading={isLoading}
                    error={error as Error}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default ProductsPage;
