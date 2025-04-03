import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartSidebar } from "@/components/cart/cart-sidebar";
import { ProductCard } from "@/components/ui/product-card";
import { ProductWithDetails, PRODUCT_CATEGORIES } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { 
  Slider, 
  CheckboxItem, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilterIcon, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type FilterState = {
  minPrice: number;
  maxPrice: number;
  colors: string[];
  sizes: string[];
  sort: string;
};

export default function CategoryPage() {
  const [, params] = useRoute<{ category: string }>("/category/:category");
  const category = params?.category || "";
  
  // State
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 200,
    colors: [],
    sizes: [],
    sort: "newest",
  });
  
  // Set page title
  useEffect(() => {
    const formattedCategory = category === "new-arrivals" 
      ? "New Arrivals" 
      : category.charAt(0).toUpperCase() + category.slice(1);
    document.title = `${formattedCategory} - FootwearFusion`;
  }, [category]);
  
  // Query products by category or special type
  const { data, isLoading } = useQuery<ProductWithDetails[]>({
    queryKey: [
      category === "new-arrivals" 
        ? "/api/products/new-arrivals" 
        : category === "sale"
        ? "/api/products/sale"
        : `/api/products/category/${category}`
    ],
  });
  
  // Apply filters to products
  const filteredProducts = data
    ? data.filter((product) => {
        const price = product.finalPrice;
        const colorMatch = filters.colors.length === 0 || 
          filters.colors.some(color => product.colors.includes(color));
        const sizeMatch = filters.sizes.length === 0 || 
          filters.sizes.some(size => product.sizes.includes(size));
        
        return price >= filters.minPrice && 
               price <= filters.maxPrice && 
               colorMatch && 
               sizeMatch;
      })
    : [];
  
  // Sort products
  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
    switch (filters.sort) {
      case "price-low":
        return a.finalPrice - b.finalPrice;
      case "price-high":
        return b.finalPrice - a.finalPrice;
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  
  // Get all available colors and sizes from products
  const availableColors = data
    ? Array.from(new Set(data.flatMap(product => product.colors)))
    : [];
  
  const availableSizes = data
    ? Array.from(new Set(data.flatMap(product => product.sizes)))
    : [];
  
  // Update price range filter
  const handlePriceChange = (value: [number, number]) => {
    setFilters({
      ...filters,
      minPrice: value[0],
      maxPrice: value[1],
    });
  };
  
  // Toggle color filter
  const toggleColorFilter = (color: string) => {
    setFilters({
      ...filters,
      colors: filters.colors.includes(color)
        ? filters.colors.filter(c => c !== color)
        : [...filters.colors, color],
    });
  };
  
  // Toggle size filter
  const toggleSizeFilter = (size: string) => {
    setFilters({
      ...filters,
      sizes: filters.sizes.includes(size)
        ? filters.sizes.filter(s => s !== size)
        : [...filters.sizes, size],
    });
  };
  
  // Change sort order
  const handleSortChange = (value: string) => {
    setFilters({
      ...filters,
      sort: value,
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 200,
      colors: [],
      sizes: [],
      sort: "newest",
    });
  };
  
  // Format category name
  const getCategoryTitle = () => {
    if (category === "new-arrivals") return "New Arrivals";
    if (category === "sale") return "Sale";
    return category.charAt(0).toUpperCase() + category.slice(1);
  };
  
  // Format category description
  const getCategoryDescription = () => {
    switch (category) {
      case "men":
        return "Discover our premium collection of men's shoes, designed for comfort and style.";
      case "women":
        return "Explore our stylish and comfortable women's shoes for every occasion.";
      case "children":
        return "Quality and comfortable shoes for children, designed for active play and everyday wear.";
      case "baby":
        return "Soft and supportive shoes for your little ones, perfect for first steps.";
      case "slippers":
        return "Cozy and comfortable slippers to keep your feet warm and relaxed at home.";
      case "new-arrivals":
        return "Check out our latest additions to the collection. Fresh styles for every occasion.";
      case "sale":
        return "Great deals on quality footwear. Limited time offers at special prices.";
      default:
        return "Explore our collection of quality footwear for every need.";
    }
  };
  
  // Filter panel component for both desktop and mobile
  const FilterPanel = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={isMobile ? "" : "w-64 flex-shrink-0"}>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Price Range</h3>
          <div className="px-2">
            <Slider
              defaultValue={[filters.minPrice, filters.maxPrice]}
              min={0}
              max={200}
              step={5}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={handlePriceChange}
              className="mb-6"
            />
            <div className="flex justify-between text-sm">
              <span>${filters.minPrice}</span>
              <span>${filters.maxPrice}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Colors</h3>
          <div className="space-y-2">
            {availableColors.map((color) => (
              <div key={color} className="flex items-center">
                <Checkbox
                  id={`color-${color}${isMobile ? "-mobile" : ""}`}
                  checked={filters.colors.includes(color)}
                  onCheckedChange={() => toggleColorFilter(color)}
                />
                <Label
                  htmlFor={`color-${color}${isMobile ? "-mobile" : ""}`}
                  className="ml-2"
                >
                  {color}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-3">Sizes</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableSizes.map((size) => (
              <div key={size} className="flex items-center">
                <Checkbox
                  id={`size-${size}${isMobile ? "-mobile" : ""}`}
                  checked={filters.sizes.includes(size)}
                  onCheckedChange={() => toggleSizeFilter(size)}
                />
                <Label
                  htmlFor={`size-${size}${isMobile ? "-mobile" : ""}`}
                  className="ml-2"
                >
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        <Button
          variant="outline"
          onClick={resetFilters}
          className="w-full"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-12 bg-neutral-100">
        <div className="container mx-auto px-4">
          {/* Category Header */}
          <motion.div 
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-heading font-bold mb-2">{getCategoryTitle()}</h1>
            <p className="text-secondary">{getCategoryDescription()}</p>
          </motion.div>
          
          {/* Category Navigation */}
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-2 min-w-max p-1">
              <Link href="/category/all">
                <Button 
                  variant={category === "all" ? "default" : "outline"}
                  className="min-w-max"
                >
                  All
                </Button>
              </Link>
              {PRODUCT_CATEGORIES.map((cat) => (
                <Link key={cat} href={`/category/${cat}`}>
                  <Button 
                    variant={category === cat ? "default" : "outline"}
                    className="min-w-max"
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Button>
                </Link>
              ))}
              <Link href="/category/new-arrivals">
                <Button 
                  variant={category === "new-arrivals" ? "default" : "outline"}
                  className="min-w-max"
                >
                  New Arrivals
                </Button>
              </Link>
              <Link href="/category/sale">
                <Button 
                  variant={category === "sale" ? "default" : "outline"}
                  className="min-w-max"
                >
                  Sale
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Sort and Filter Controls - Mobile */}
          <div className="lg:hidden flex items-center justify-between mb-6 sticky top-0 z-10 bg-white/80 backdrop-blur-sm p-3 rounded-lg shadow-sm">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" onClick={() => setMobileFiltersOpen(true)} className="w-32">
                  <FilterIcon className="h-4 w-4 mr-2" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Refine your product search
                  </SheetDescription>
                </SheetHeader>
                <div className="py-4">
                  <FilterPanel isMobile={true} />
                </div>
              </SheetContent>
            </Sheet>
            
            <Select value={filters.sort} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filter Panel - Desktop */}
            <div className="hidden lg:block">
              <FilterPanel />
            </div>
            
            {/* Products Grid */}
            <div className="flex-1">
              {/* Sort Controls - Desktop */}
              <div className="hidden lg:flex justify-between items-center mb-6">
                <div>
                  <span className="text-secondary">
                    {sortedProducts.length} {sortedProducts.length === 1 ? 'product' : 'products'}
                  </span>
                </div>
                <Select value={filters.sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
                      <Skeleton className="h-64 w-full" />
                      <div className="p-4 space-y-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-6 w-48" />
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-10 w-10 rounded-full" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No products found</h3>
                  <p className="text-secondary mb-6">
                    Try adjusting your filters or check out our other categories.
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: {
                      transition: {
                        staggerChildren: 0.1,
                      },
                    },
                    hidden: {},
                  }}
                >
                  {sortedProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                      }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <CartSidebar />
    </div>
  );
}
