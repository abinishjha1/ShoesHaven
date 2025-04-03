import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProductsPage from "@/pages/products-page";
import ProductDetailPage from "@/pages/product-detail-page";
import CartPage from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminProducts from "@/pages/admin/products";
import AddProduct from "@/pages/admin/add-product";
import { ProtectedRoute } from "./lib/protected-route";
import { AdminRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./context/cart-context";

function Router() {
  const [location, setLocation] = useLocation();
  
  // Redirect to auth page when application first loads
  useEffect(() => {
    // Only redirect if we're at the root path and not coming from somewhere else
    if (location === '/' && !sessionStorage.getItem('visited')) {
      sessionStorage.setItem('visited', 'true');
      setLocation('/auth');
    }
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/products/category/:category" component={ProductsPage} />
      <Route path="/products/:id" component={ProductDetailPage} />
      <ProtectedRoute path="/cart" component={CartPage} />
      <ProtectedRoute path="/checkout" component={CheckoutPage} />
      <AdminRoute path="/admin" component={AdminDashboard} />
      <AdminRoute path="/admin/products" component={AdminProducts} />
      <AdminRoute path="/admin/products/add" component={AddProduct} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router />
        <Toaster />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
