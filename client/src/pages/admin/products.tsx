import { useState } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Product } from "@shared/schema";
import {
  LayoutDashboard,
  Package2,
  ShoppingCart,
  Settings,
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getStockStatus, getCategoryLabel } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

const ProductsPage = () => {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState<"name" | "price" | "category" | "createdAt">("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Fetch products
  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });
  
  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle sort
  const handleSort = (column: "name" | "price" | "category" | "createdAt") => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };
  
  // Filter and sort products
  const filteredProducts = products
    ? products
        .filter((product) => {
          // Filter by search query
          const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
            
          // Filter by category
          const matchesCategory =
            categoryFilter === "all" || product.category === categoryFilter;
            
          return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
          // Sort by selected column
          let comparison = 0;
          
          switch (sortColumn) {
            case "name":
              comparison = a.name.localeCompare(b.name);
              break;
            case "price":
              comparison = Number(a.price) - Number(b.price);
              break;
            case "category":
              comparison = a.category.localeCompare(b.category);
              break;
            case "createdAt":
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
          }
          
          return sortDirection === "asc" ? comparison : -comparison;
        })
    : [];
    
  // Handle delete product
  const handleDeleteProduct = (id: number) => {
    deleteProductMutation.mutate(id);
  };
  
  return (
    <>
      <Helmet>
        <title>Manage Products | Footwear Fusion</title>
        <meta
          name="description"
          content="Manage products in your Footwear Fusion store."
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
                <a className="flex items-center gap-2 p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-primary">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </a>
              </Link>
              <Link href="/admin/products">
                <a className="flex items-center gap-2 p-2 rounded-md bg-muted text-primary font-medium">
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
              <h1 className="text-2xl font-bold">Products</h1>
              <Link href="/admin/products/add">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </Link>
            </div>
          </header>
          
          <main className="p-6">
            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search products..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="men">Men's Shoes</SelectItem>
                      <SelectItem value="women">Women's Shoes</SelectItem>
                      <SelectItem value="children">Children's Shoes</SelectItem>
                      <SelectItem value="baby">Baby Shoes</SelectItem>
                      <SelectItem value="slippers">Slippers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            {/* Products Table */}
            {isLoading ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center text-destructive">
                <p>Error loading products. Please try again later.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <Package2 className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p>No products found. Try adjusting your filters or add a new product.</p>
                <div className="mt-4">
                  <Link href="/admin/products/add">
                    <Button>Add Product</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">ID</TableHead>
                        <TableHead className="w-16">Image</TableHead>
                        <TableHead className="min-w-[150px]">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 font-semibold"
                            onClick={() => handleSort("name")}
                          >
                            Name
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 font-semibold"
                            onClick={() => handleSort("price")}
                          >
                            Price
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 font-semibold"
                            onClick={() => handleSort("category")}
                          >
                            Category
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => {
                        const stockStatus = getStockStatus(product);
                        
                        return (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.id}</TableCell>
                            <TableCell>
                              <div className="w-10 h-10 bg-neutral-100 rounded overflow-hidden">
                                <img
                                  src={product.imageUrls[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{product.name}</div>
                              {product.featured && (
                                <span className="inline-flex items-center text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 mt-1">
                                  Featured
                                </span>
                              )}
                              {product.newArrival && (
                                <span className="inline-flex items-center text-xs bg-accent/10 text-accent rounded-full px-2 py-0.5 mt-1 ml-1">
                                  New
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              {product.discountPercentage > 0 ? (
                                <div>
                                  <span className="line-through text-muted-foreground">
                                    {formatCurrency(Number(product.price))}
                                  </span>
                                  <span className="block font-semibold text-accent">
                                    {formatCurrency(
                                      Number(product.price) * (1 - product.discountPercentage / 100)
                                    )}
                                  </span>
                                </div>
                              ) : (
                                formatCurrency(Number(product.price))
                              )}
                            </TableCell>
                            <TableCell className="capitalize">
                              {getCategoryLabel(product.category)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                {product.inStock ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-red-600 mr-1" />
                                )}
                                <span className={stockStatus.color}>
                                  {stockStatus.text}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Link href={`/admin/products/edit/${product.id}`}>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default ProductsPage;
