import { useState } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LayoutDashboard,
  Package2,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronLeft,
  Plus,
  X,
} from "lucide-react";
import { insertProductSchema, type InsertProduct } from "@shared/schema";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

// Extend the insert schema for the form
const productFormSchema = insertProductSchema.extend({
  // Add additional validation for arrays
  imageUrls: z.string().array().min(1, "At least one image is required"),
  sizes: z.string().array().min(1, "At least one size is required"),
  colors: z.string().array().min(1, "At least one color is required"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const AddProductPage = () => {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  // Input state for array fields
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSize, setNewSize] = useState("");
  const [newColor, setNewColor] = useState("");
  
  // Form setup
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "0.00",
      category: "men",
      imageUrls: [],
      sizes: [],
      colors: [],
      inStock: true,
      featured: false,
      newArrival: false,
      discountPercentage: 0,
    },
  });
  
  // Watch array values for rendering
  const imageUrls = form.watch("imageUrls");
  const sizes = form.watch("sizes");
  const colors = form.watch("colors");
  
  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await apiRequest("POST", "/api/products", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product created",
        description: "The product has been created successfully.",
      });
      navigate("/admin/products");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating product",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Add image URL to array
  const addImageUrl = () => {
    if (!newImageUrl) return;
    if (newImageUrl.trim() === "") return;
    
    // Validate URL format
    try {
      new URL(newImageUrl);
    } catch (e) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }
    
    const updatedUrls = [...imageUrls, newImageUrl];
    form.setValue("imageUrls", updatedUrls);
    setNewImageUrl("");
  };
  
  // Remove image URL from array
  const removeImageUrl = (index: number) => {
    const updatedUrls = [...imageUrls];
    updatedUrls.splice(index, 1);
    form.setValue("imageUrls", updatedUrls);
  };
  
  // Add size to array
  const addSize = () => {
    if (!newSize) return;
    if (newSize.trim() === "") return;
    if (sizes.includes(newSize)) {
      toast({
        title: "Size already exists",
        description: "This size is already in the list",
        variant: "destructive",
      });
      return;
    }
    
    const updatedSizes = [...sizes, newSize];
    form.setValue("sizes", updatedSizes);
    setNewSize("");
  };
  
  // Remove size from array
  const removeSize = (index: number) => {
    const updatedSizes = [...sizes];
    updatedSizes.splice(index, 1);
    form.setValue("sizes", updatedSizes);
  };
  
  // Add color to array
  const addColor = () => {
    if (!newColor) return;
    if (newColor.trim() === "") return;
    if (colors.includes(newColor)) {
      toast({
        title: "Color already exists",
        description: "This color is already in the list",
        variant: "destructive",
      });
      return;
    }
    
    const updatedColors = [...colors, newColor];
    form.setValue("colors", updatedColors);
    setNewColor("");
  };
  
  // Remove color from array
  const removeColor = (index: number) => {
    const updatedColors = [...colors];
    updatedColors.splice(index, 1);
    form.setValue("colors", updatedColors);
  };
  
  // Form submission
  const onSubmit = (data: ProductFormValues) => {
    createProductMutation.mutate(data);
  };
  
  return (
    <>
      <Helmet>
        <title>Add Product | Footwear Fusion</title>
        <meta
          name="description"
          content="Add a new product to your Footwear Fusion store."
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
              <div className="flex items-center">
                <Link href="/admin/products">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold">Add Product</h1>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Basic Information */}
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter product name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="men">Men's Shoes</SelectItem>
                                <SelectItem value="women">Women's Shoes</SelectItem>
                                <SelectItem value="children">Children's Shoes</SelectItem>
                                <SelectItem value="baby">Baby Shoes</SelectItem>
                                <SelectItem value="slippers">Slippers</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter product description"
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Pricing and Inventory */}
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Pricing and Inventory</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                  $
                                </span>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="pl-8"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="discountPercentage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Discount (%)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="1"
                                  className="pr-8"
                                  {...field}
                                />
                                <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  %
                                </span>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="inStock"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>In Stock</FormLabel>
                              <FormDescription>
                                Mark if the product is available for purchase
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <FormField
                        control={form.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>Featured Product</FormLabel>
                              <FormDescription>
                                Featured products appear on the homepage
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="newArrival"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>New Arrival</FormLabel>
                              <FormDescription>
                                New arrivals are highlighted in the store
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Images */}
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Product Images</h2>
                    <FormField
                      control={form.control}
                      name="imageUrls"
                      render={() => (
                        <FormItem>
                          <div className="flex gap-2 mb-4">
                            <Input
                              placeholder="Enter image URL"
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                            />
                            <Button
                              type="button"
                              onClick={addImageUrl}
                              className="flex items-center gap-1"
                            >
                              <Plus className="h-4 w-4" />
                              Add
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-2">
                            {imageUrls.map((url, index) => (
                              <div
                                key={index}
                                className="relative border rounded-md overflow-hidden group"
                              >
                                <img
                                  src={url}
                                  alt={`Product image ${index + 1}`}
                                  className="w-full h-40 object-cover"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => removeImageUrl(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  {/* Variants: Sizes and Colors */}
                  <div>
                    <h2 className="text-lg font-semibold mb-4">Product Variants</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Sizes */}
                      <FormField
                        control={form.control}
                        name="sizes"
                        render={() => (
                          <FormItem>
                            <FormLabel>Sizes</FormLabel>
                            <div className="flex gap-2 mb-2">
                              <Input
                                placeholder="Add size (e.g. 8, M, XL)"
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                              />
                              <Button
                                type="button"
                                onClick={addSize}
                                className="flex items-center gap-1"
                              >
                                <Plus className="h-4 w-4" />
                                Add
                              </Button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {sizes.map((size, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1 bg-neutral-100 rounded-full px-3 py-1"
                                >
                                  <span>{size}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => removeSize(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {/* Colors */}
                      <FormField
                        control={form.control}
                        name="colors"
                        render={() => (
                          <FormItem>
                            <FormLabel>Colors</FormLabel>
                            <div className="flex gap-2 mb-2">
                              <Input
                                placeholder="Add color (e.g. Black, Red)"
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                              />
                              <Button
                                type="button"
                                onClick={addColor}
                                className="flex items-center gap-1"
                              >
                                <Plus className="h-4 w-4" />
                                Add
                              </Button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mt-2">
                              {colors.map((color, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-1 bg-neutral-100 rounded-full px-3 py-1"
                                >
                                  <span>{color}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => removeColor(index)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-4 pt-4">
                    <Link href="/admin/products">
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </Link>
                    <Button 
                      type="submit" 
                      disabled={createProductMutation.isPending}
                    >
                      {createProductMutation.isPending ? "Creating..." : "Create Product"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AddProductPage;
