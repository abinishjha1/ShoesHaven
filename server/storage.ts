import { users, products, cartItems, orders, orderItems, type User, type InsertUser, type Product, type InsertProduct, type CartItem, type InsertCartItem, type Order, type InsertOrder, type OrderItem, type InsertOrderItem } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  
  // Cart operations
  getCartItemsByUserId(userId: number): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeCartItem(id: number): Promise<boolean>;
  clearCart(userId: number): Promise<boolean>;
  
  // Order operations
  createOrder(order: InsertOrder, orderItems: InsertOrderItem[]): Promise<Order>;
  getOrdersByUserId(userId: number): Promise<Order[]>;
  getOrderById(id: number): Promise<Order | undefined>;
  getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem>;
  
  sessionStore: session.SessionStore;
  private userIdCounter: number;
  private productIdCounter: number;
  private cartItemIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with some sample products
    this.initializeProducts();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    
    const user: User = { 
      ...insertUser, 
      id, 
      isAdmin: false,
      createdAt: now
    };
    
    this.users.set(id, user);
    return user;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.featured
    );
  }

  async getNewArrivals(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.newArrival
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    
    const newProduct: Product = {
      ...product,
      id,
      createdAt: now
    };
    
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    
    if (!existingProduct) {
      return undefined;
    }
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...product,
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Cart operations
  async getCartItemsByUserId(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if the same product with same attributes is already in cart
    const existingItems = await this.getCartItemsByUserId(cartItem.userId);
    const existingItem = existingItems.find(
      item => 
        item.productId === cartItem.productId && 
        item.color === cartItem.color && 
        item.size === cartItem.size
    );
    
    if (existingItem) {
      // Update quantity instead of adding a new item
      return this.updateCartItem(existingItem.id, existingItem.quantity + cartItem.quantity) as Promise<CartItem>;
    }
    
    const id = this.cartItemIdCounter++;
    const now = new Date();
    
    const newCartItem: CartItem = {
      ...cartItem,
      id,
      createdAt: now
    };
    
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    
    if (!cartItem) {
      return undefined;
    }
    
    const updatedCartItem: CartItem = {
      ...cartItem,
      quantity
    };
    
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }

  async removeCartItem(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId: number): Promise<boolean> {
    const userCartItems = await this.getCartItemsByUserId(userId);
    
    for (const item of userCartItems) {
      this.cartItems.delete(item.id);
    }
    
    return true;
  }

  // Order operations
  async createOrder(orderData: InsertOrder, orderItemsData: InsertOrderItem[]): Promise<Order> {
    const orderId = this.orderIdCounter++;
    const now = new Date();
    
    const order: Order = {
      ...orderData,
      id: orderId,
      createdAt: now
    };
    
    this.orders.set(orderId, order);
    
    // Create order items
    for (const itemData of orderItemsData) {
      const orderItemId = this.orderItemIdCounter++;
      
      const orderItem: OrderItem = {
        ...itemData,
        id: orderItemId,
        orderId
      };
      
      this.orderItems.set(orderItemId, orderItem);
    }
    
    // Clear user's cart
    await this.clearCart(orderData.userId);
    
    return order;
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter(order => order.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values())
      .filter(item => item.orderId === orderId);
  }

  // Initialize some sample products
  private initializeProducts() {
    // Men's shoes
    const menShoes = [
      {
        name: "Urban Street Sneakers",
        description: "Comfortable and stylish urban street sneakers perfect for everyday wear.",
        price: "89.99",
        category: "men",
        imageUrls: [
          "https://images.unsplash.com/photo-1560769629-975ec94e6a86",
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2"
        ],
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["Black", "White", "Grey"],
        inStock: true,
        featured: true,
        newArrival: false,
        discountPercentage: 0
      },
      {
        name: "Premium Runner Shoes",
        description: "High-quality running shoes designed for comfort and performance.",
        price: "119.99",
        category: "men",
        imageUrls: [
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d"
        ],
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["Blue", "Black", "Red"],
        inStock: true,
        featured: false,
        newArrival: true,
        discountPercentage: 0
      },
      {
        name: "Classic Formal Shoes",
        description: "Elegant formal shoes perfect for business and special occasions.",
        price: "129.99",
        category: "men",
        imageUrls: [
          "https://images.unsplash.com/photo-1546215364-12f3fff5d578",
          "https://images.unsplash.com/photo-1531310197839-ccf54634509e"
        ],
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["Black", "Brown"],
        inStock: true,
        featured: false,
        newArrival: false,
        discountPercentage: 10
      },
      {
        name: "Hiking Trail Boots",
        description: "Durable hiking boots designed for tough terrain and long-lasting comfort.",
        price: "149.99",
        category: "men",
        imageUrls: [
          "https://images.unsplash.com/photo-1520219306100-7da13cee09cb",
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff"
        ],
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["Brown", "Green", "Black"],
        inStock: true,
        featured: false,
        newArrival: false,
        discountPercentage: 0
      },
      {
        name: "Casual Canvas Shoes",
        description: "Lightweight canvas shoes perfect for casual outings and everyday wear.",
        price: "59.99",
        category: "men",
        imageUrls: [
          "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77",
          "https://images.unsplash.com/photo-1463100099107-aa0980c362e6"
        ],
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["Navy", "White", "Red"],
        inStock: true,
        featured: true,
        newArrival: false,
        discountPercentage: 0
      },
      {
        name: "Leather Loafers",
        description: "Premium leather loafers combining comfort with sophisticated style.",
        price: "99.99",
        category: "men",
        imageUrls: [
          "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4",
          "https://images.unsplash.com/photo-1531310197839-ccf54634509e"
        ],
        sizes: ["7", "8", "9", "10", "11", "12"],
        colors: ["Black", "Brown", "Tan"],
        inStock: true,
        featured: false,
        newArrival: true,
        discountPercentage: 0
      }
    ];

    // Women's shoes
    const womenShoes = [
      {
        name: "Elegance High Heels",
        description: "Stylish high heels perfect for formal occasions and evening outings.",
        price: "129.99",
        category: "women",
        imageUrls: [
          "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
          "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f"
        ],
        sizes: ["5", "6", "7", "8", "9", "10"],
        colors: ["Black", "Red", "Nude"],
        inStock: true,
        featured: true,
        newArrival: false,
        discountPercentage: 0
      },
      {
        name: "Women's Fashion Flats",
        description: "Comfortable and stylish flats for everyday elegance.",
        price: "79.99",
        category: "women",
        imageUrls: [
          "https://images.unsplash.com/photo-1554133222-86872f49e562",
          "https://images.unsplash.com/photo-1518049362265-d5b2a6467637"
        ],
        sizes: ["5", "6", "7", "8", "9", "10"],
        colors: ["Black", "Pink", "Silver"],
        inStock: true,
        featured: false,
        newArrival: true,
        discountPercentage: 0
      },
      {
        name: "Running Performance Shoes",
        description: "Athletic shoes designed for optimal running performance and comfort.",
        price: "99.99",
        category: "women",
        imageUrls: [
          "https://images.unsplash.com/photo-1511556532299-8f662fc26c06",
          "https://images.unsplash.com/photo-1460353581641-37baddab0fa2"
        ],
        sizes: ["5", "6", "7", "8", "9", "10"],
        colors: ["Purple", "Blue", "Pink"],
        inStock: true,
        featured: false,
        newArrival: false,
        discountPercentage: 15
      },
      {
        name: "Ankle Boots",
        description: "Stylish ankle boots perfect for fall and winter seasons.",
        price: "119.99",
        category: "women",
        imageUrls: [
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2",
          "https://images.unsplash.com/photo-1502716125140-e39697da329a"
        ],
        sizes: ["5", "6", "7", "8", "9", "10"],
        colors: ["Black", "Brown", "Grey"],
        inStock: true,
        featured: true,
        newArrival: false,
        discountPercentage: 0
      },
      {
        name: "Summer Sandals",
        description: "Comfortable and elegant sandals for warm weather days.",
        price: "69.99",
        category: "women",
        imageUrls: [
          "https://images.unsplash.com/photo-1562273138-f46be4ebdf33",
          "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95"
        ],
        sizes: ["5", "6", "7", "8", "9", "10"],
        colors: ["White", "Brown", "Gold"],
        inStock: true,
        featured: false,
        newArrival: true,
        discountPercentage: 0
      },
      {
        name: "Ballet Flats",
        description: "Classic ballet flats that combine elegance with everyday comfort.",
        price: "89.99",
        category: "women",
        imageUrls: [
          "https://images.unsplash.com/photo-1518049362265-d5b2a6467637",
          "https://images.unsplash.com/photo-1562273138-f46be4ebdf33"
        ],
        sizes: ["5", "6", "7", "8", "9", "10"],
        colors: ["Black", "Beige", "Navy"],
        inStock: true,
        featured: false,
        newArrival: false,
        discountPercentage: 0
      }
    ];

    // Children's shoes
    const childrenShoes = [
      {
        name: "Playful Children Runners",
        description: "Comfortable and durable running shoes for active children.",
        price: "59.99",
        category: "children",
        imageUrls: [
          "https://images.unsplash.com/photo-1569513611144-c041f994d4b8",
          "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2"
        ],
        sizes: ["12C", "13C", "1Y", "2Y", "3Y", "4Y"],
        colors: ["Blue", "Red", "Green"],
        inStock: true,
        featured: true,
        newArrival: false,
        discountPercentage: 25
      },
      {
        name: "Kids School Shoes",
        description: "Durable and comfortable shoes perfect for school days.",
        price: "49.99",
        category: "children",
        imageUrls: [
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
          "https://images.unsplash.com/photo-1608571423902-ced127d14abe"
        ],
        sizes: ["12C", "13C", "1Y", "2Y", "3Y", "4Y"],
        colors: ["Black", "Navy"],
        inStock: true,
        featured: false,
        newArrival: false,
        discountPercentage: 0
      },
      {
        name: "Waterproof Rain Boots",
        description: "Colorful and waterproof boots to keep little feet dry on rainy days.",
        price: "39.99",
        category: "children",
        imageUrls: [
          "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
          "https://images.unsplash.com/photo-1608571423902-ced127d14abe"
        ],
        sizes: ["12C", "13C", "1Y", "2Y", "3Y", "4Y"],
        colors: ["Yellow", "Pink", "Blue"],
        inStock: true,
        featured: false,
        newArrival: true,
        discountPercentage: 0
      },
      {
        name: "Light-up Sneakers",
        description: "Fun sneakers with light-up soles that kids love to wear.",
        price: "44.99",
        category: "children",
        imageUrls: [
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
          "https://images.unsplash.com/photo-1608571423902-ced127d14abe"
        ],
        sizes: ["12C", "13C", "1Y", "2Y", "3Y", "4Y"],
        colors: ["White", "Black", "Red"],
        inStock: true,
        featured: true,
        newArrival: false,
        discountPercentage: 0
      },
      {
        name: "Sport Sandals",
        description: "Comfortable and durable sandals for active summer days.",
        price: "34.99",
        category: "children",
        imageUrls: [
          "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2",
          "https://images.unsplash.com/photo-1608571423902-ced127d14abe"
        ],
        sizes: ["12C", "13C", "1Y", "2Y", "3Y", "4Y"],
        colors: ["Navy", "Orange", "Green"],
        inStock: true,
        featured: false,
        newArrival: true,
        discountPercentage: 0
      },
      {
        name: "Winter Snow Boots",
        description: "Warm and waterproof boots designed for snowy winter days.",
        price: "54.99",
        category: "children",
        imageUrls: [
          "https://images.unsplash.com/photo-1608571423902-ced127d14abe",
          "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a"
        ],
        sizes: ["12C", "13C", "1Y", "2Y", "3Y", "4Y"],
        colors: ["Black", "Purple", "Blue"],
        inStock: true,
        featured: false,
        newArrival: false,
        discountPercentage: 10
      }
    ];

    // Baby shoes
    const babyShoes = [
      {
        name: "Baby's First Steps Shoes",
        description: "Soft and supportive shoes perfect for babies learning to walk.",
        price: "49.99",
        category: "baby",
        imageUrls: [
          "https://images.unsplash.com/photo-1573309463328-7b8c57d96c42",
          "https://images.unsplash.com/photo-1576566265240-9aa3e84eace9"
        ],
        sizes: ["0-6M", "6-12M", "12-18M"],
        colors: ["Pink", "Blue", "Yellow"],
        inStock: true,
        featured: false,
        newArrival: true,
        discountPercentage: 0
      },
      {
        name: "Soft Sole Booties",
        description: "Cozy and warm booties to keep tiny feet comfortable.",
        price: "29.99",
        category: "baby",
        imageUrls: [
          "https://images.unsplash.com/photo-1576566265240-9aa3e84eace9",
          "https://images.unsplash.com/photo-1573309463328-7b8c57d96c42"
        ],
        sizes: ["0-6M", "6-12M", "12-18M"],
        colors: ["Grey", "Beige", "Pink"],
        inStock: true,
        featured: true,
        newArrival: false,
        discountPercentage: 0
      },
      {
        name: "Pre-walker Sandals",
        description: "Cute and comfortable sandals for warm weather days.",
        price: "24.99",
        category: "baby",
        imageUrls: [
          "https://images.unsplash.com/photo-1573309463328-7b8c57d96c42",
          "https://images.unsplash.com/photo-1576566265240-9aa3e84eace9"
        ],
        sizes: ["0-6M", "6-12M", "12-18M"],
        colors: ["White", "Pink", "Blue"],
        inStock: true,
        featured: false,
        newArrival: false,
        discountPercentage: 15
      },
      {
        name: "Crib Shoes",
        description: "Soft and stylish shoes perfect for newborns and crawlers.",
        price: "19.99",
        category: "baby",
        imageUrls: [
          "https://images.unsplash.com/photo-1576566265240-9aa3e84eace9",
          "https://images.unsplash.com/photo-1573309463328-7b8c57d96c42"
        ],
        sizes: ["0-6M", "6-12M"],
        colors: ["White", "Grey", "Pink"],
        inStock: true,
        featured: true,
        newArrival: false,
        discountPercentage: 0
      },
      {
        name: "Winter Baby Boots",
        description: "Warm and cozy boots to protect little feet in cold weather.",
        price: "39.99",
        category: "baby",
        imageUrls: [
          "https://images.unsplash.com/photo-1573309463328-7b8c57d96c42",
          "https://images.unsplash.com/photo-1576566265240-9aa3e84eace9"
        ],
        sizes: ["6-12M", "12-18M", "18-24M"],
        colors: ["Brown", "Grey", "Navy"],
        inStock: true,
        featured: false,
        newArrival: true,
        discountPercentage: 0
      },
      {
        name: "Animal Character Shoes",
        description: "Fun and adorable shoes featuring cute animal characters.",
        price: "34.99",
        category: "baby",
        imageUrls: [
          "https://images.unsplash.com/photo-1576566265240-9aa3e84eace9",
          "https://images.unsplash.com/photo-1573309463328-7b8c57d96c42"
        ],
        sizes: ["6-12M", "12-18M", "18-24M"],
        colors: ["Multi"],
        inStock: true,
        featured: false,
        newArrival: false,
        discountPercentage: 10
      }
    ];

    // Slippers
    const slippers = [
      {
        name: "Cozy Home Slippers",
        description: "Warm and comfortable slippers perfect for relaxing at home.",
        price: "34.99",
        category: "slippers",
        imageUrls: [
          "https://images.unsplash.com/photo-1574706633388-35d9936cfb38",
          "https://images.unsplash.com/photo-1586798133310-c43f3b66e5b6"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Grey", "Brown", "Navy"],
        inStock: true,
        featured: true,
        newArrival: false,
        discountPercentage: 0
      },
      {
        name: "Memory Foam Slippers",
        description: "Ultra-comfortable memory foam slippers for ultimate relaxation.",
        price: "39.99",
        category: "slippers",
        imageUrls: [
          "https://images.unsplash.com/photo-1586798133310-c43f3b66e5b6",
          "https://images.unsplash.com/photo-1574706633388-35d9936cfb38"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Burgundy", "Beige"],
        inStock: true,
        featured: false,
        newArrival: true,
        discountPercentage: 0
      },
      {
        name: "Fluffy Slide Slippers",
        description: "Soft and fluffy slide slippers that are easy to slip on and off.",
        price: "29.99",
        category: "slippers",
        imageUrls: [
          "https://images.unsplash.com/photo-1574706633388-35d9936cfb38",
          "https://images.unsplash.com/photo-1586798133310-c43f3b66e5b6"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Pink", "Grey", "White"],
        inStock: true,
        featured: false,
        newArrival: false,
        discountPercentage: 15
      },
      {
        name: "Indoor/Outdoor Slippers",
        description: "Versatile slippers with durable soles suitable for both indoor and outdoor use.",
        price: "44.99",
        category: "slippers",
        imageUrls: [
          "https://images.unsplash.com/photo-1586798133310-c43f3b66e5b6",
          "https://images.unsplash.com/photo-1574706633388-35d9936cfb38"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Brown", "Black", "Grey"],
        inStock: true,
        featured: true,
        newArrival: false,
        discountPercentage: 0
      },
      {
        name: "Kids Novelty Slippers",
        description: "Fun character slippers that children will love to wear.",
        price: "24.99",
        category: "slippers",
        imageUrls: [
          "https://images.unsplash.com/photo-1574706633388-35d9936cfb38",
          "https://images.unsplash.com/photo-1586798133310-c43f3b66e5b6"
        ],
        sizes: ["S", "M", "L"],
        colors: ["Multi"],
        inStock: true,
        featured: false,
        newArrival: true,
        discountPercentage: 0
      },
      {
        name: "Heated Slippers",
        description: "Electric heated slippers to keep your feet warm during cold winter days.",
        price: "49.99",
        category: "slippers",
        imageUrls: [
          "https://images.unsplash.com/photo-1586798133310-c43f3b66e5b6",
          "https://images.unsplash.com/photo-1574706633388-35d9936cfb38"
        ],
        sizes: ["M", "L"],
        colors: ["Grey", "Navy"],
        inStock: true,
        featured: false,
        newArrival: false,
        discountPercentage: 10
      }
    ];

    const allProducts = [...menShoes, ...womenShoes, ...childrenShoes, ...babyShoes, ...slippers];
    
    // Add all products to the storage
    for (const product of allProducts) {
      this.createProduct(product as InsertProduct);
    }
    
    // Create an admin user
    this.createUser({
      username: "admin",
      password: "admin123", // This would be hashed in auth.ts
      email: "admin@example.com"
    }).then(user => {
      // Update user to be admin
      user.isAdmin = true;
      this.users.set(user.id, user);
    });
  }
}

export const storage = new MemStorage();
