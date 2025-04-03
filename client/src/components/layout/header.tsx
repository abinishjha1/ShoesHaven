import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import MobileMenu from "./mobile-menu";
import CartDrawer from "./cart-drawer";

// Re-import useAuth and useCart 
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logoutMutation } = useAuth();
  const { cartItems } = useCart();
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        navigate("/");
      }
    });
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top bar */}
      <div className="bg-primary text-white py-2 shadow-md">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <p className="text-sm md:text-base font-medium">
            <span className="inline-block animate-pulse mr-2">🔥</span>
            Free shipping on orders over $50
          </p>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm md:text-base font-medium">Hello, {user.username}</span>
                <span className="text-sm">|</span>
                <button 
                  onClick={handleLogout} 
                  className="text-sm md:text-base hover:underline transition-colors hover:text-blue-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  href="/auth" 
                  className="text-sm md:text-base hover:underline transition-colors hover:text-blue-200"
                >
                  Login
                </Link>
                <span className="text-sm">|</span>
                <Link 
                  href="/auth?tab=register" 
                  className="text-sm md:text-base hover:underline transition-colors hover:text-blue-200"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link href="/" className="text-2xl md:text-3xl font-bold text-primary animate-fade-in">
              Footwear<span className="text-accent">Fusion</span>
              <span className="ml-1 text-xs align-top text-primary opacity-70">®</span>
            </Link>

            {/* Search - desktop */}
            <div className="hidden md:block w-1/3">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search for shoes..."
                  className="w-full py-2 pl-4 pr-10 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Navigation links - desktop */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <Link href="/products/category/men" className="font-medium hover:text-accent">
                  Men
                </Link>
                <div className="absolute z-10 mt-2 w-48 bg-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                  <Link href="/products/category/men" className="block px-4 py-2 hover:bg-neutral-100">
                    Casual Shoes
                  </Link>
                  <Link href="/products/category/men" className="block px-4 py-2 hover:bg-neutral-100">
                    Formal Shoes
                  </Link>
                  <Link href="/products/category/men" className="block px-4 py-2 hover:bg-neutral-100">
                    Sports Shoes
                  </Link>
                  <Link href="/products/category/slippers" className="block px-4 py-2 hover:bg-neutral-100">
                    Slippers
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <Link href="/products/category/women" className="font-medium hover:text-accent">
                  Women
                </Link>
                <div className="absolute z-10 mt-2 w-48 bg-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                  <Link href="/products/category/women" className="block px-4 py-2 hover:bg-neutral-100">
                    Heels
                  </Link>
                  <Link href="/products/category/women" className="block px-4 py-2 hover:bg-neutral-100">
                    Flats
                  </Link>
                  <Link href="/products/category/women" className="block px-4 py-2 hover:bg-neutral-100">
                    Casual Shoes
                  </Link>
                  <Link href="/products/category/slippers" className="block px-4 py-2 hover:bg-neutral-100">
                    Slippers
                  </Link>
                </div>
              </div>
              <div className="relative group">
                <Link href="/products/category/children" className="font-medium hover:text-accent">
                  Kids
                </Link>
                <div className="absolute z-10 mt-2 w-48 bg-white rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transform -translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                  <Link href="/products/category/children" className="block px-4 py-2 hover:bg-neutral-100">
                    Children's Shoes
                  </Link>
                  <Link href="/products/category/baby" className="block px-4 py-2 hover:bg-neutral-100">
                    Baby Shoes
                  </Link>
                  <Link href="/products/category/children" className="block px-4 py-2 hover:bg-neutral-100">
                    School Shoes
                  </Link>
                </div>
              </div>
              <Link href="/products/category/slippers" className="font-medium hover:text-accent">
                Slippers
              </Link>
              <Link href="/" className="font-medium hover:text-accent">
                Sale
              </Link>
            </nav>

            {/* Cart and menu icons */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="relative"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingBag className="h-6 w-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile search - shown only on mobile */}
          <div className="mt-4 md:hidden">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search for shoes..."
                className="w-full py-2 pl-4 pr-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 text-muted-foreground"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Cart drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};

export default Header;
