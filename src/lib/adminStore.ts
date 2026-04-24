import { products as initialProducts } from "@/data/products";
import { CheckoutOrder } from "./checkoutStore";

const DEFAULT_PRODUCT_IMAGE = "/file.svg";

// --- Types ---
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: "active" | "archived";
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  description?: string;
  variations?: string[];
  stock: number;
  status: "active" | "inactive" | "out_of_stock";
  createdAt: string;
}

// --- In-Memory Stores ---
let products: Product[] = initialProducts.map(p => ({
  ...p,
  image: p.image || DEFAULT_PRODUCT_IMAGE,
  stock: Math.floor(Math.random() * 50),
  status: "active" as const,
  category: p.category || "General",
  createdAt: new Date().toISOString()
}));

let categories: Category[] = [
  { id: "electronics", name: "Electronics", slug: "electronics", description: "Laptops, phones, and high-tech gear.", status: "active", createdAt: new Date().toISOString() },
  { id: "fashion", name: "Fashion", slug: "fashion", description: "Clothing, shoes, and luxury accessories.", status: "active", createdAt: new Date().toISOString() },
  { id: "home", name: "Home & Living", slug: "home", description: "Furniture, decor, and kitchen essentials.", status: "active", createdAt: new Date().toISOString() },
  { id: "fitness", name: "Fitness", slug: "fitness", description: "Gym equipment and health accessories.", status: "active", createdAt: new Date().toISOString() },
];

// --- Product Actions ---
export const getAdminProducts = () => products;

export const addAdminProduct = (product: Partial<Product>) => {
  const newProduct: Product = { 
    id: String(Date.now()),
    name: product.name || "Untitled",
    price: product.price || 0,
    category: product.category || "General",
    image: product.image || DEFAULT_PRODUCT_IMAGE,
    description: product.description || "",
    variations: product.variations || [],
    stock: product.stock || 0,
    status: (product.stock || 0) > 0 ? "active" : "out_of_stock",
    createdAt: new Date().toISOString()
  };
  products.push(newProduct);
  return newProduct;
};

export const updateAdminProduct = (id: string, updatedProduct: Partial<Product>) => {
  products = products.map(p => p.id === id ? { ...p, ...updatedProduct, image: updatedProduct.image || p.image || DEFAULT_PRODUCT_IMAGE } : p);
  return products.find(p => p.id === id);
};

export const removeAdminProduct = (id: string) => {
  products = products.filter(p => p.id !== id);
};

export const bulkDeleteProducts = (ids: string[]) => {
  products = products.filter(p => !ids.includes(p.id));
};

export const bulkUpdateStatus = (ids: string[], status: Product["status"]) => {
  products = products.map(p => ids.includes(p.id) ? { ...p, status } : p);
};

// --- Category Actions ---
export const getAdminCategories = () => categories;

export const addAdminCategory = (name: string, description?: string) => {
  const category: Category = { 
    id: name.toLowerCase().replace(/ /g, "-"), 
    name, 
    slug: name.toLowerCase().replace(/ /g, "-"),
    description,
    status: "active",
    createdAt: new Date().toISOString()
  };
  categories.push(category);
  return category;
};

export const updateAdminCategory = (id: string, updated: Partial<Category>) => {
  categories = categories.map(c => c.id === id ? { ...c, ...updated } : c);
  return categories.find(c => c.id === id);
};

export const removeAdminCategory = (id: string) => {
  categories = categories.filter(c => c.id !== id);
};

export const bulkDeleteCategories = (ids: string[]) => {
  categories = categories.filter(c => !ids.includes(c.id));
};

// --- Sales Analytics ---
export const getAdminStats = (orders: CheckoutOrder[]) => {
  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const estimatedProfit = totalSales * 0.3; 
  
  const outOfStockCount = products.filter(p => p.stock <= 0).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return {
    totalSales,
    totalOrders,
    estimatedProfit,
    outOfStockCount,
    totalProducts: products.length,
    totalInventoryValue
  };
};
