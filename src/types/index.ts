export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  stock: number;
  features: string[];
  specs?: Record<string, string>;
  fullDescription?: string;
  variants?: Array<{
    color: string; // hex or name
    label: string;
    image: string;
  }>;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserActivity {
  productId: string;
  action: 'view' | 'cart' | 'purchase';
  timestamp: number;
  category?: string;
  tags?: string[];
}

export interface Recommendation {
  product: Product;
  score: number;
  reason: string;
}
