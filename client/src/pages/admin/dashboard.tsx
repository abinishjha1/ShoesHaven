import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Product, Order } from "@shared/schema";
import {
  Users,
  ShoppingBag,
  Package,
  DollarSign,
  BarChart3,
  PieChart,
  Package2,
  ShoppingCart,
  LayoutDashboard,
  Settings,
  LogOut,
  ArrowUpRight,
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

// Stub data for demo purposes
const recentOrders = [
  {
    id: 1,
    customer: "Sarah Johnson",
    status: "delivered",
    date: "2023-05-15",
    total: 189.99,
  },
  {
    id: 2,
    customer: "Michael Rodriguez",
    status: "processing",
    date: "2023-05-17",
    total: 129.98,
  },
  {
    id: 3,
    customer: "Emily Thompson",
    status: "pending",
    date: "2023-05-18",
    total: 79.99,
  },
];

const salesData = [
  { name: "Jan", total: 1200 },
  { name: "Feb", total: 1500 },
  { name: "Mar", total: 1800 },
  { name: "Apr", total: 1600 },
  { name: "May", total: 2200 },
  { name: "Jun", total: 2400 },
];

const AdminDashboard = () => {
  const { user, logoutMutation } = useAuth();
  
  // Fetch products
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Stats calculations
  const totalProducts = products?.length || 0;
  const lowStockProducts = products?.filter(product => !product.inStock).length || 0;
  const featuredProducts = products?.filter(product => product.featured).length || 0;
  
  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Footwear Fusion</title>
        <meta
          name="description"
          content="Admin dashboard for Footwear Fusion. Manage products, orders, and customers."
        />
      </Helmet>
      
      <div className="min-h-screen bg-neutral-100 flex">
        {/* Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-white border-r border-neutral-200">
          <div className="p-4 border-b border-neutral-200">
            <Link href="/" className="text-xl font-bold font-montserrat text-primary">
              Footwear<span className="text-accent">Fusion</span>
            </Link>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
          
          <div className="p-4">
            <div className="flex items-center gap-3 mb-6">
              <Avatar>
                <AvatarFallback>{user?.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            
            <nav className="space-y-1">
              <Link href="/admin">
                <a className="flex items-center gap-2 p-2 rounded-md bg-muted text-primary font-medium">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </a>
              </Link>
              <Link href="/admin/products">
                <a className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-primary">
                  <Package2 className="h-4 w-4" />
                  Products
                </a>
              </Link>
              <Link href="/admin/orders">
                <a className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-primary">
                  <ShoppingCart className="h-4 w-4" />
                  Orders
                </a>
              </Link>
              <Link href="/admin/settings">
                <a className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-primary">
                  <Settings className="h-4 w-4" />
                  Settings
                </a>
              </Link>
            </nav>
          </div>
          
          <div className="mt-auto p-4 border-t border-neutral-200">
            <Button
              variant="ghost"
              className="flex items-center gap-2 w-full justify-start text-muted-foreground"
              onClick={() => logoutMutation.mutate()}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white border-b border-neutral-200 py-4 px-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <div className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="outline" className="flex items-center gap-2">
                    <ArrowUpRight className="h-4 w-4" />
                    View Store
                  </Button>
                </Link>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-accent/20 p-3 rounded-full">
                      <DollarSign className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Revenue</p>
                      <p className="text-2xl font-bold">$12,543.00</p>
                      <p className="text-xs text-green-600">+2.5% from last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <ShoppingBag className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Orders</p>
                      <p className="text-2xl font-bold">156</p>
                      <p className="text-xs text-green-600">+12% from last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Customers</p>
                      <p className="text-2xl font-bold">423</p>
                      <p className="text-xs text-green-600">+8% from last month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Products</p>
                      <p className="text-2xl font-bold">{totalProducts}</p>
                      <p className="text-xs text-muted-foreground">{lowStockProducts} low stock</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salesData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip
                          formatter={(value: number) => [`$${value}`, 'Revenue']}
                        />
                        <Bar dataKey="total" fill="#4A4A4A" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Status</CardTitle>
                  <CardDescription>Product stock information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Package2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Products</p>
                        <p className="text-xl font-bold">{totalProducts}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                        <Package2 className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Low Stock Products</p>
                        <p className="text-xl font-bold">{lowStockProducts}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Package2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Featured Products</p>
                        <p className="text-xl font-bold">{featuredProducts}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      <Link href="/admin/products">
                        <Button variant="outline" className="w-full">
                          Manage Products
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from customers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-200">
                        <th className="text-left p-2 text-sm font-medium text-muted-foreground">Order ID</th>
                        <th className="text-left p-2 text-sm font-medium text-muted-foreground">Customer</th>
                        <th className="text-left p-2 text-sm font-medium text-muted-foreground">Status</th>
                        <th className="text-left p-2 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-right p-2 text-sm font-medium text-muted-foreground">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id} className="border-b border-neutral-200 hover:bg-muted/50">
                          <td className="p-2">#{order.id}</td>
                          <td className="p-2">{order.customer}</td>
                          <td className="p-2">
                            <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="p-2">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="p-2 text-right">{formatCurrency(order.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <Link href="/admin/orders">
                    <Button variant="outline">View All Orders</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
