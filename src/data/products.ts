import { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 249.99,
    category: 'electronics',
    tags: ['audio', 'wireless', 'noise-cancelling', 'premium'],
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=60',
    ],
    rating: 4.8,
    reviews: 1243,
    stock: 45,
    features: ['Active Noise Cancellation', '30h Battery', 'Bluetooth 5.0', 'Premium Sound'],
    fullDescription: 'Experience audio like never before with the Wireless Bluetooth Headphones. Designed for audiophiles and commuters alike, these headphones feature state-of-the-art active noise cancellation that blocks out environmental noise, letting you focus on your music. With a 30-hour battery life, you can enjoy multiple days of use on a single charge. The ergonomic over-ear design ensures comfort during long listening sessions.',
    specs: {
      'Bluetooth Version': '5.0',
      'Battery Life': '30 Hours',
      'Charging Port': 'USB-C',
      'Weight': '250g',
      'Drivers': '40mm Dynamic',
      'Frequency Response': '20Hz - 20kHz'
    },
    variants: [
      { color: '#000000', label: 'Matte Black', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60' },
      { color: '#FFFFFF', label: 'Arctic White', image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=60' },
      { color: '#808080', label: 'Silver Mist', image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=60' }
    ]
  },
  {
    id: '2',
    name: 'Smart Fitness Watch',
    description: 'Track your health and fitness with GPS, heart rate monitoring, and sleep tracking.',
    price: 199.99,
    category: 'electronics',
    tags: ['wearable', 'fitness', 'health', 'smart'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60',
    ],
    rating: 4.6,
    reviews: 892,
    stock: 78,
    features: ['GPS Tracking', 'Heart Rate Monitor', 'Water Resistant', '7-Day Battery'],
    fullDescription: 'The Smart Fitness Watch is your ultimate companion for a healthy lifestyle. Whether you are running, cycling, or swimming, the built-in GPS tracks your route and pace accurately. Monitor your heart rate in real-time and gain insights into your sleep patterns to optimize your recovery. With a water-resistant design and a long-lasting battery, it is built to keep up with your most intense workouts.',
    specs: {
      'Display': '1.4" AMOLED',
      'Water Resistance': '5ATM',
      'Battery Life': 'Up to 7 Days',
      'Sensors': 'Optical Heart Rate, GPS, Accelerometer',
      'Connectivity': 'Bluetooth Low Energy',
      'Compatibility': 'iOS & Android'
    },
    variants: [
      { color: '#FFFFFF', label: 'Classic White', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60' },
      { color: '#000000', label: 'Obsidian Black', image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=60' },
      { color: '#4A90E2', label: 'Ocean Blue', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=60' }
    ]
  },
  {
    id: '3',
    name: 'Minimalist Leather Backpack',
    description: 'Handcrafted genuine leather backpack with laptop compartment and organized storage.',
    price: 179.99,
    category: 'fashion',
    tags: ['leather', 'backpack', 'minimalist', 'handcrafted'],
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=60',
    ],
    rating: 4.9,
    reviews: 567,
    stock: 23,
    features: ['Genuine Leather', 'Laptop Sleeve', 'Water Resistant', 'Handcrafted'],
    fullDescription: 'The Minimalist Leather Backpack is designed for the modern professional. Crafted from premium top-grain leather, it develops a unique patina over time. The dedicated laptop compartment fits up to a 15-inch MacBook, while multiple internal pockets keep your essentials organized. Water-resistant and handcrafted with precision.',
    specs: {
      'Material': 'Top-grain Bovine Leather',
      'Dimensions': '18" x 12" x 5"',
      'Capacity': '20 Liters',
      'Laptop Fit': 'Up to 15"',
      'Hardware': 'Antique Brass'
    }
  },
  {
    id: '4',
    name: 'Organic Cotton T-Shirt',
    description: 'Sustainably sourced organic cotton tee with a relaxed fit and breathable fabric.',
    price: 34.99,
    category: 'fashion',
    tags: ['organic', 'sustainable', 'cotton', 'casual'],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=60',
    ],
    rating: 4.5,
    reviews: 2156,
    stock: 150,
    features: ['100% Organic Cotton', 'Sustainable', 'Pre-shrunk', 'Breathable'],
    fullDescription: 'Our Organic Cotton T-Shirt is the foundation of a sustainable wardrobe. Made from 100% GOTS certified organic cotton, it is incredibly soft on the skin and kind to the planet. The relaxed fit ensures all-day comfort, whether you are layering it or wearing it on its own.',
    specs: {
      'Fabric': '100% GOTS Organic Cotton',
      'Weight': '180 GSM',
      'Certification': 'GOTS Certified',
      'Care': 'Machine wash cold, tumble dry low'
    }
  },
  {
    id: '5',
    name: '4K Webcam Pro',
    description: 'Professional 4K webcam with auto-focus, noise reduction mic, and wide angle lens.',
    price: 129.99,
    category: 'electronics',
    tags: ['webcam', '4k', 'streaming', 'professional'],
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    reviews: 445,
    stock: 34,
    features: ['4K Resolution', 'Auto-focus', 'Noise Reduction Mic', 'Wide Angle']
  },
  {
    id: '6',
    name: 'Ceramic Coffee Mug Set',
    description: 'Set of 4 handcrafted ceramic mugs, microwave and dishwasher safe.',
    price: 49.99,
    category: 'home',
    tags: ['ceramic', 'coffee', ' Set', 'handcrafted'],
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    reviews: 334,
    stock: 67,
    features: ['Handcrafted', 'Microwave Safe', 'Dishwasher Safe', 'Set of 4']
  },
  {
    id: '7',
    name: 'Yoga Mat Premium',
    description: 'Extra thick, non-slip yoga mat with carrying strap and alignment guides.',
    price: 59.99,
    category: 'fitness',
    tags: ['yoga', 'fitness', 'exercise', 'non-slip'],
    image: 'https://images.unsplash.com/photo-1602189046132-9b36dc3e7850?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    reviews: 1123,
    stock: 89,
    features: ['6mm Thick', 'Non-slip', 'Eco-friendly', 'Carrying Strap']
  },
  {
    id: '8',
    name: 'Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with hot-swappable switches and customizable keys.',
    price: 159.99,
    category: 'electronics',
    tags: ['keyboard', 'mechanical', 'gaming', 'rgb'],
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    reviews: 2234,
    stock: 56,
    features: ['Hot-swappable', 'RGB Backlight', 'Mechanical Switches', 'USB-C']
  },
  {
    id: '9',
    name: 'Succulent Plant Collection',
    description: 'Set of 6 assorted succulents in decorative pots, perfect for home or office.',
    price: 39.99,
    category: 'home',
    tags: ['plants', 'succulents', 'decor', 'low-maintenance'],
    image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    reviews: 445,
    stock: 43,
    features: ['Set of 6', 'Decorative Pots', 'Low Maintenance', 'Indoor']
  },
  {
    id: '10',
    name: 'Running Shoes Pro',
    description: 'Lightweight running shoes with cushioned sole and breathable mesh upper.',
    price: 119.99,
    category: 'fashion',
    tags: ['shoes', 'running', 'athletic', 'breathable'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    reviews: 1889,
    stock: 75,
    features: ['Lightweight', 'Cushioned Sole', 'Breathable Mesh', 'Durable']
  },
  {
    id: '11',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° sound, 20-hour battery, and built-in microphone.',
    price: 79.99,
    category: 'electronics',
    tags: ['audio', 'speaker', 'portable', 'waterproof'],
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    reviews: 1678,
    stock: 92,
    features: ['360° Sound', 'Waterproof', '20h Battery', 'Built-in Mic']
  },
  {
    id: '12',
    name: 'Scented Candle Set',
    description: 'Set of 3 luxury scented candles with natural soy wax and essential oils.',
    price: 44.99,
    category: 'home',
    tags: ['candles', 'scented', 'soy wax', 'luxury'],
    image: 'https://images.unsplash.com/photo-1602605169702-23588f35a98b?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    reviews: 556,
    stock: 38,
    features: ['Natural Soy Wax', 'Essential Oils', 'Long Burning', 'Set of 3']
  },
  {
    id: '13',
    name: 'Universal Headphone Stand',
    description: 'Sleek aluminum stand with a non-slip base, compatible with all over-ear headphones.',
    price: 29.99,
    category: 'electronics',
    tags: ['audio', 'accessory', 'office'],
    image: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    reviews: 156,
    stock: 120,
    features: ['Aerospace Aluminum', 'Silicone Grip', 'Cable Management'],
    specs: {
      'Material': 'Aluminum',
      'Base': 'Weighted Silicone',
      'Height': '10 inches'
    }
  },
  {
    id: '14',
    name: 'Screen Cleaning Kit',
    description: 'Professional grade microfiber cloth and streak-free spray for all your digital displays.',
    price: 14.99,
    category: 'electronics',
    tags: ['accessory', 'maintenance', 'tech'],
    image: 'https://images.unsplash.com/photo-1585338447937-7082f89763d5?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    reviews: 890,
    stock: 300,
    features: ['Alcohol Free', 'Microfiber Included', 'Safe for 4K'],
    specs: {
      'Volume': '200ml',
      'Ingredients': 'Distilled Water, Non-ionic surfactants'
    }
  }
];

export const categories = [
  { id: 'all', name: 'All Products', count: products.length },
  { id: 'electronics', name: 'Electronics', count: products.filter(p => p.category === 'electronics').length },
  { id: 'fashion', name: 'Fashion', count: products.filter(p => p.category === 'fashion').length },
  { id: 'home', name: 'Home & Living', count: products.filter(p => p.category === 'home').length },
  { id: 'fitness', name: 'Fitness', count: products.filter(p => p.category === 'fitness').length },
];
