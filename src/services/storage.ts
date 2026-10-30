/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Product,
  Category,
  Order,
  Coupon,
  Customer,
  InventoryMovement,
  AdminActivityLog,
  SiteSettings,
  UserProfile,
  CartItem,
  OrderStatus,
  PaymentStatus,
} from '../types';

const STORAGE_KEYS = {
  PRODUCTS: 'siench_products_v2',
  CATEGORIES: 'siench_categories_v2',
  ORDERS: 'siench_orders_v2',
  COUPONS: 'siench_coupons_v2',
  CUSTOMERS: 'siench_customers_v2',
  INVENTORY_LOGS: 'siench_inventory_logs_v2',
  ACTIVITY_LOGS: 'siench_activity_logs_v2',
  SITE_SETTINGS: 'siench_site_settings_v2',
  CART: 'siench_cart_v2',
  WISHLIST: 'siench_wishlist_v2',
  AUTH_USER: 'siench_auth_user_v2',
  ADMIN_SESSION: 'siench_admin_session_v2',
};

// Initial 7 Verified Products with proper root-relative public URLs
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'SIENCH SHADOW TOTE',
    slug: 'siench-shadow-tote',
    price: 589000,
    originalPrice: 659000,
    description: 'Tas hitam dengan desain minimalis dan siluet modern untuk menemani aktivitas sehari-hari.',
    category: 'Tote Bags',
    images: [
      '/images/products/siench-shadow-tote.jpg',
      '/images/tote-bag.jpg'
    ],
    stock: 18,
    minStock: 5,
    sku: 'SNC-ST-001',
    dimensions: '38 x 34 x 12 cm',
    material: 'Premium Vegan Leather Glossy Finish',
    tags: ['NEW ARRIVAL', 'BEST SELLER'],
    isActive: true,
    featured: true,
    salesCount: 42,
    createdAt: '2026-10-15T10:00:00.000Z',
  },
  {
    id: 'prod-2',
    name: 'SIENCH NOIR BLOSSOM',
    slug: 'siench-noir-blossom',
    price: 749000,
    originalPrice: 829000,
    description: 'Tas dengan motif floral monokrom yang memadukan karakter gelap dengan sentuhan artistik.',
    category: 'Floral Bags',
    images: [
      '/images/products/siench-noir-blossom.jpg',
      '/images/floral-bag.jpg'
    ],
    stock: 12,
    minStock: 4,
    sku: 'SNC-NB-002',
    dimensions: '42 x 30 x 14 cm',
    material: 'Soft Heavy Canvas with Silver Floral Print & Gunmetal Chain Strap',
    tags: ['LIMITED EDITION', 'SIGNATURE'],
    isActive: true,
    featured: true,
    salesCount: 29,
    createdAt: '2026-10-18T12:30:00.000Z',
  },
  {
    id: 'prod-3',
    name: 'SIENCH MIDNIGHT FLORAL',
    slug: 'siench-midnight-floral',
    price: 629000,
    originalPrice: 699000,
    description: 'Tote bag bermotif floral yang menghadirkan karakter unik, elegan, dan ekspresif.',
    category: 'Tote Bags',
    images: [
      '/images/products/siench-midnight-floral.jpg',
      '/images/products/siench-noir-blossom.jpg'
    ],
    stock: 15,
    minStock: 5,
    sku: 'SNC-MF-003',
    dimensions: '36 x 32 x 10 cm',
    material: 'Silky Satin Weave with Embroidered Floral Motifs',
    tags: ['NEW ARRIVAL'],
    isActive: true,
    featured: true,
    salesCount: 31,
    createdAt: '2026-10-20T09:15:00.000Z',
  },
  {
    id: 'prod-4',
    name: 'SIENCH URBAN STUD',
    slug: 'siench-urban-stud',
    price: 699000,
    originalPrice: 779000,
    description: 'Tas hitam bergaya urban dengan detail metalik yang tegas dan tampilan modern.',
    category: 'Sling Bags',
    images: [
      '/images/products/siench-urban-stud.jpg',
      '/images/sling-bag.jpg'
    ],
    stock: 14,
    minStock: 4,
    sku: 'SNC-US-004',
    dimensions: '40 x 28 x 15 cm',
    material: 'Textured Pebbled Leather with Matte Black Metal Hardware & Detachable Crossbody Strap',
    tags: ['BEST SELLER'],
    isActive: true,
    featured: true,
    salesCount: 38,
    createdAt: '2026-10-22T14:45:00.000Z',
  },
  {
    id: 'prod-5',
    name: 'SIENCH ESSENTIAL HOBO',
    slug: 'siench-essential-hobo',
    price: 559000,
    originalPrice: 619000,
    description: 'Tas hitam dengan siluet modern dan tekstur elegan untuk gaya kasual sehari-hari.',
    category: 'Hobo Bags',
    images: [
      '/images/products/siench-essential-hobo.jpg',
      '/images/hobo-bag.jpg'
    ],
    stock: 20,
    minStock: 6,
    sku: 'SNC-EH-005',
    dimensions: '44 x 36 x 14 cm',
    material: 'Supple Grain Leather with Slouchy Ergonomic Shape',
    tags: ['SIGNATURE'],
    isActive: true,
    featured: true,
    salesCount: 45,
    createdAt: '2026-10-24T11:00:00.000Z',
  },
  {
    id: 'prod-6',
    name: 'SIENCH NOIR CARD HOLDER',
    slug: 'siench-noir-card-holder',
    price: 289000,
    originalPrice: 349000,
    description: 'Dompet kartu kulit bertekstur dengan slot presisi, ramping dan elegan untuk esensial Anda.',
    category: 'Card Holders',
    images: [
      '/images/categories/card-holders.jpg',
      '/images/card-holder.jpg'
    ],
    stock: 25,
    minStock: 5,
    sku: 'SNC-CH-006',
    dimensions: '10 x 8 x 0.5 cm',
    material: 'Full Grain Black Pebbled Leather with Multi Card Slots',
    tags: ['NEW ARRIVAL'],
    isActive: true,
    featured: true,
    salesCount: 52,
    createdAt: '2026-10-26T08:00:00.000Z',
  },
  {
    id: 'prod-7',
    name: 'SIENCH NOIR LEATHER POUCH',
    slug: 'siench-noir-leather-pouch',
    price: 349000,
    originalPrice: 399000,
    description: 'Pouch serbaguna berbalut kulit hitam pekat dengan ritsleting gunmetal kokoh.',
    category: 'Pouches',
    images: [
      '/images/categories/pouches.jpg',
      '/images/pouch.jpg'
    ],
    stock: 22,
    minStock: 4,
    sku: 'SNC-PC-007',
    dimensions: '20 x 12 x 7 cm',
    material: 'Supple Matte Black Leather with Metal Zipper',
    tags: ['BEST SELLER'],
    isActive: true,
    featured: true,
    salesCount: 39,
    createdAt: '2026-10-27T10:00:00.000Z',
  },
];

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Tote Bags',
    slug: 'tote-bags',
    description: 'Tas jinjing berkapasitas luas dengan siluet tegas dan elegan.',
    image: '/images/categories/tote-bags.jpg',
    itemCount: 2,
  },
  {
    id: 'cat-2',
    name: 'Sling Bags',
    slug: 'sling-bags',
    description: 'Kenyamanan di pundak dengan proporsi fashion kontemporer & tali modular.',
    image: '/images/categories/sling-bags.jpg',
    itemCount: 1,
  },
  {
    id: 'cat-3',
    name: 'Card Holders',
    slug: 'card-holders',
    description: 'Dompet kartu kulit ramping dengan presisi jahitan dan slot multifungsi.',
    image: '/images/categories/card-holders.jpg',
    itemCount: 1,
  },
  {
    id: 'cat-4',
    name: 'Pouches',
    slug: 'pouches',
    description: 'Pouch serbaguna berbalut kulit hitam lembut dengan ritsleting gunmetal.',
    image: '/images/categories/pouches.jpg',
    itemCount: 1,
  },
  {
    id: 'cat-5',
    name: 'Hobo Bags',
    slug: 'hobo-bags',
    description: 'Siluet lembut fleksibel untuk gaya santai yang berkelas.',
    image: '/images/categories/hobo-bags.jpg',
    itemCount: 1,
  },
  {
    id: 'cat-6',
    name: 'Floral Bags',
    slug: 'floral-bags',
    description: 'Karakter gelap berpadu motif artistik bunga monokromatik.',
    image: '/images/categories/floral-bags.jpg',
    itemCount: 2,
  },
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'SIENCHDARK',
    discountType: 'percentage',
    value: 10,
    minPurchase: 500000,
    maxDiscount: 100000,
    expiryDate: '2026-12-31',
    usageLimit: 500,
    usedCount: 34,
    isActive: true,
  },
  {
    id: 'coup-2',
    code: 'FIRSTSIENCH',
    discountType: 'fixed',
    value: 50000,
    minPurchase: 400000,
    expiryDate: '2026-12-31',
    usageLimit: 300,
    usedCount: 22,
    isActive: true,
  },
  {
    id: 'coup-3',
    code: 'BLACKLUXURY',
    discountType: 'percentage',
    value: 15,
    minPurchase: 1000000,
    maxDiscount: 250000,
    expiryDate: '2026-11-30',
    usageLimit: 100,
    usedCount: 15,
    isActive: true,
  },
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'SNC-20261026-001',
    customerName: 'Nadia Pratama',
    customerWhatsApp: '081234567890',
    customerEmail: 'nadia.pratama@example.com',
    shippingAddress: {
      fullName: 'Nadia Pratama',
      phone: '081234567890',
      address: 'Jl. Senopati No. 45, Kebayoran Baru',
      city: 'Jakarta Selatan',
      province: 'DKI Jakarta',
      postalCode: '12190',
    },
    items: [
      {
        productId: 'prod-1',
        name: 'SIENCH SHADOW TOTE',
        price: 589000,
        quantity: 1,
        image: '/images/products/siench-shadow-tote.jpg',
        sku: 'SNC-ST-001',
      },
    ],
    subtotal: 589000,
    discount: 50000,
    shippingCost: 15000,
    totalAmount: 554000,
    paymentMethod: 'qris',
    paymentStatus: 'Paid',
    orderStatus: 'Completed',
    trackingNumber: 'JNE-8829103810',
    shippingCourier: 'JNE Reguler',
    couponCode: 'FIRSTSIENCH',
    isDemo: true,
    createdAt: '2026-10-26T14:20:00.000Z',
    updatedAt: '2026-10-27T10:00:00.000Z',
  },
  {
    id: 'ord-2',
    orderNumber: 'SNC-20261028-002',
    customerName: 'Dimas Arya',
    customerWhatsApp: '082198765432',
    customerEmail: 'dimas.arya@example.com',
    shippingAddress: {
      fullName: 'Dimas Arya',
      phone: '082198765432',
      address: 'Jl. Riau No. 12, Citarum',
      city: 'Bandung',
      province: 'Jawa Barat',
      postalCode: '40115',
    },
    items: [
      {
        productId: 'prod-4',
        name: 'SIENCH URBAN STUD',
        price: 699000,
        quantity: 1,
        image: '/images/products/siench-urban-stud.jpg',
        sku: 'SNC-US-004',
      },
    ],
    subtotal: 699000,
    discount: 69900,
    shippingCost: 18000,
    totalAmount: 647100,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    trackingNumber: 'SICEPAT-991204859',
    shippingCourier: 'SiCepat BEST',
    couponCode: 'SIENCHDARK',
    isDemo: true,
    createdAt: '2026-10-28T09:15:00.000Z',
    updatedAt: '2026-10-28T16:00:00.000Z',
  },
  {
    id: 'ord-3',
    orderNumber: 'SNC-20261029-003',
    customerName: 'Clara Veronica',
    customerWhatsApp: '085611223344',
    customerEmail: 'clara.v@example.com',
    shippingAddress: {
      fullName: 'Clara Veronica',
      phone: '085611223344',
      address: 'Pakuwon City Laguna Regency Blok F-8',
      city: 'Surabaya',
      province: 'Jawa Timur',
      postalCode: '60112',
    },
    items: [
      {
        productId: 'prod-2',
        name: 'SIENCH NOIR BLOSSOM',
        price: 749000,
        quantity: 1,
        image: '/images/products/siench-noir-blossom.jpg',
        sku: 'SNC-NB-002',
      },
      {
        productId: 'prod-5',
        name: 'SIENCH ESSENTIAL HOBO',
        price: 559000,
        quantity: 1,
        image: '/images/products/siench-essential-hobo.jpg',
        sku: 'SNC-EH-005',
      },
    ],
    subtotal: 1308000,
    discount: 196200,
    shippingCost: 22000,
    totalAmount: 1133800,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    shippingCourier: 'J&T Express',
    couponCode: 'BLACKLUXURY',
    isDemo: true,
    createdAt: '2026-10-29T11:45:00.000Z',
    updatedAt: '2026-10-29T13:00:00.000Z',
  },
];

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Nadia Pratama',
    email: 'nadia.pratama@example.com',
    phone: '081234567890',
    city: 'Jakarta Selatan',
    registeredAt: '2026-10-20T10:00:00.000Z',
    orderCount: 1,
    totalSpent: 554000,
  },
  {
    id: 'cust-2',
    name: 'Dimas Arya',
    email: 'dimas.arya@example.com',
    phone: '082198765432',
    city: 'Bandung',
    registeredAt: '2026-10-22T14:30:00.000Z',
    orderCount: 1,
    totalSpent: 647100,
  },
  {
    id: 'cust-3',
    name: 'Clara Veronica',
    email: 'clara.v@example.com',
    phone: '085611223344',
    city: 'Surabaya',
    registeredAt: '2026-10-25T08:15:00.000Z',
    orderCount: 1,
    totalSpent: 1133800,
  },
];

const INITIAL_SETTINGS: SiteSettings = {
  brandName: 'SIENCH · Buttonberry',
  brandPhilosophy: 'Your Style. Your Identity.',
  mainSlogan: 'OWN YOUR DARK SIDE.',
  subSlogan: 'Modern bags. Timeless attitude.',
  brandStatement: 'BLACK IS NOT JUST A COLOR. IT\'S AN ATTITUDE.',
  brandStatementDesc: 'SIENCH by Buttonberry menghadirkan tas fashion dengan karakter minimalis, detail yang kuat, dan desain yang mengekspresikan identitas personal.',
  whatsappNumber: '6281290008899',
  instagramUrl: 'https://instagram.com/siench.official',
  tiktokUrl: 'https://tiktok.com/@siench.official',
  supportEmail: 'care@siench.com',
  storeAddress: 'Jl. Senopati Raya No. 88, Kebayoran Baru, Jakarta Selatan 12190',
  shippingPolicy: 'Pengiriman dilakukan setiap hari kerja (Senin - Sabtu). Pesanan terverifikasi sebelum pukul 15.00 WIB dikirim pada hari yang sama. Estimasi tiba 1-3 hari kerja untuk Jabodetabek dan 2-5 hari untuk kota lainnya.',
  returnPolicy: 'Garansi penukaran produk berlaku 7 hari setelah pesanan diterima jika terdapat cacat produksi atau ketidaksesuaian barang. Kondisi produk wajib dalam keadaan baru, tag masih terpasang, dan menyertakan video unboxing.',
  heroHeadline: 'OWN YOUR DARK SIDE.',
  heroSubheadline: 'Modern bags. Timeless attitude. Koleksi tas fashion eksklusif dengan presisi craftsmanship dan sentuhan dark luxury.',
  heroButtonText: 'EXPLORE COLLECTION',
  heroBannerImage: '/images/banners/hero-banner.jpg',
  announcementText: 'PROMO BULAN INI: KODE "SIENCHDARK" DISKON 10% DENGAN MINIMAL BELANJA RP 500.000',
  announcementActive: true,
};

export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return dateStr;
  }
};

// Storage Service implementation
export const StorageService = {
  // Products
  getProducts(): Product[] {
    const data = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_PRODUCTS;
    }
  },

  getProductBySlug(slug: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.slug === slug || p.id === slug);
  },

  getProductById(id: string): Product | undefined {
    const products = this.getProducts();
    return products.find((p) => p.id === id);
  },

  saveProduct(product: Partial<Product>): Product {
    const products = this.getProducts();
    let saved: Product;

    if (product.id) {
      // Edit
      const index = products.findIndex((p) => p.id === product.id);
      if (index >= 0) {
        const oldProduct = products[index];
        saved = {
          ...oldProduct,
          ...product,
        } as Product;
        products[index] = saved;

        // Log inventory movement if stock changed
        if (product.stock !== undefined && product.stock !== oldProduct.stock) {
          this.logInventoryMovement({
            productId: saved.id,
            productName: saved.name,
            sku: saved.sku,
            changeAmount: product.stock - oldProduct.stock,
            previousStock: oldProduct.stock,
            newStock: product.stock,
            reason: 'Correction',
          });
        }
      } else {
        saved = product as Product;
        products.push(saved);
      }
    } else {
      // Create new
      const id = 'prod-' + Date.now();
      const slug = product.name
        ? product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : 'product-' + Date.now();
      saved = {
        id,
        name: product.name || 'Untitled Bag',
        slug,
        price: Number(product.price) || 0,
        originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined,
        description: product.description || '',
        category: product.category || 'Tote Bag',
        images: product.images && product.images.length > 0 ? product.images : ['/images/products/siench-shadow-tote.jpg'],
        stock: Number(product.stock) || 10,
        minStock: Number(product.minStock) || 3,
        sku: product.sku || 'SNC-' + Math.floor(1000 + Math.random() * 9000),
        dimensions: product.dimensions || '38 x 32 x 12 cm',
        material: product.material || 'Premium Dark Leather',
        tags: product.tags || ['NEW ARRIVAL'],
        isActive: product.isActive !== undefined ? product.isActive : true,
        featured: !!product.featured,
        salesCount: 0,
        createdAt: new Date().toISOString(),
      };
      products.push(saved);

      this.logInventoryMovement({
        productId: saved.id,
        productName: saved.name,
        sku: saved.sku,
        changeAmount: saved.stock,
        previousStock: 0,
        newStock: saved.stock,
        reason: 'Restock',
      });
    }

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    this.logAdminActivity('Product ' + (product.id ? 'Updated' : 'Created'), `Product "${saved.name}" (${saved.sku})`);
    return saved;
  },

  deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const target = products.find((p) => p.id === id);
    if (!target) return false;
    const filtered = products.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    this.logAdminActivity('Product Deleted', `Removed "${target.name}" (${target.sku})`);
    return true;
  },

  // Categories
  getCategories(): Category[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategory(category: Partial<Category>): Category {
    const categories = this.getCategories();
    let saved: Category;
    if (category.id) {
      const idx = categories.findIndex((c) => c.id === category.id);
      if (idx >= 0) {
        saved = { ...categories[idx], ...category } as Category;
        categories[idx] = saved;
      } else {
        saved = category as Category;
        categories.push(saved);
      }
    } else {
      const id = 'cat-' + Date.now();
      saved = {
        id,
        name: category.name || 'New Category',
        slug: (category.name || 'cat').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: category.description || '',
      };
      categories.push(saved);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.logAdminActivity('Category Saved', `Category "${saved.name}"`);
    return saved;
  },

  deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    this.logAdminActivity('Category Deleted', `ID: ${id}`);
    return true;
  },

  // Orders
  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
      return INITIAL_ORDERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_ORDERS;
    }
  },

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id || o.orderNumber === id);
  },

  // Server-side order creation with stock validation & concurrency simulation
  createOrder(orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): { success: boolean; order?: Order; error?: string } {
    const products = this.getProducts();

    // 1. Stock validation check: ensure requested quantities are available
    for (const item of orderData.items) {
      const p = products.find((prod) => prod.id === item.productId);
      if (!p) {
        return { success: false, error: `Produk "${item.name}" tidak ditemukan di database katalog.` };
      }
      if (!p.isActive) {
        return { success: false, error: `Produk "${item.name}" saat ini dinonaktifkan.` };
      }
      if (p.stock < item.quantity) {
        return {
          success: false,
          error: `Stok tidak mencukupi untuk "${item.name}". Sisa stok: ${p.stock}, jumlah pesanan: ${item.quantity}.`,
        };
      }
    }

    // 2. Deduct inventory & record movement logs
    for (const item of orderData.items) {
      const idx = products.findIndex((prod) => prod.id === item.productId);
      if (idx >= 0) {
        const prev = products[idx].stock;
        products[idx].stock -= item.quantity;
        products[idx].salesCount = (products[idx].salesCount || 0) + item.quantity;

        this.logInventoryMovement({
          productId: products[idx].id,
          productName: products[idx].name,
          sku: products[idx].sku,
          changeAmount: -item.quantity,
          previousStock: prev,
          newStock: products[idx].stock,
          reason: 'Sale',
        });
      }
    }
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    // 3. Create full Order
    const timestamp = new Date().toISOString();
    const dateFormatted = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SNC-${dateFormatted}-${randomSuffix}`;
    const newOrder: Order = {
      ...orderData,
      id: 'ord-' + Date.now(),
      orderNumber,
      createdAt: timestamp,
      updatedAt: timestamp,
      isDemo: false,
    };

    const orders = this.getOrders();
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // 4. Update customer profile & spend stats
    this.recordCustomerTransaction(newOrder);

    // 5. If coupon used, increment coupon usage
    if (newOrder.couponCode) {
      this.incrementCouponUsage(newOrder.couponCode);
    }

    // 6. Clear cart
    this.clearCart();

    return { success: true, order: newOrder };
  },

  updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string, courier?: string): Order | undefined {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx < 0) return undefined;

    orders[idx].orderStatus = status;
    orders[idx].updatedAt = new Date().toISOString();
    if (trackingNumber !== undefined) {
      orders[idx].trackingNumber = trackingNumber;
    }
    if (courier !== undefined) {
      orders[idx].shippingCourier = courier;
    }

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.logAdminActivity(
      'Order Status Changed',
      `Pesanan ${orders[idx].orderNumber} diubah ke ${status}${trackingNumber ? ` (Resi: ${trackingNumber})` : ''}`
    );
    return orders[idx];
  },

  updatePaymentStatus(orderId: string, status: PaymentStatus): Order | undefined {
    const orders = this.getOrders();
    const idx = orders.findIndex((o) => o.id === orderId);
    if (idx < 0) return undefined;

    orders[idx].paymentStatus = status;
    orders[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.logAdminActivity(
      'Payment Status Updated',
      `Pesanan ${orders[idx].orderNumber} status bayar diubah ke ${status}`
    );
    return orders[idx];
  },

  // Customer Management
  getCustomers(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(INITIAL_CUSTOMERS));
      return INITIAL_CUSTOMERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_CUSTOMERS;
    }
  },

  recordCustomerTransaction(order: Order) {
    const customers = this.getCustomers();
    const email = order.customerEmail || `${order.customerWhatsApp}@customer.siench`;
    const idx = customers.findIndex((c) => c.email.toLowerCase() === email.toLowerCase());

    if (idx >= 0) {
      customers[idx].orderCount += 1;
      customers[idx].totalSpent += order.totalAmount;
      customers[idx].name = order.customerName || customers[idx].name;
      customers[idx].phone = order.customerWhatsApp || customers[idx].phone;
      if (order.shippingAddress.city) {
        customers[idx].city = order.shippingAddress.city;
      }
    } else {
      customers.push({
        id: 'cust-' + Date.now(),
        name: order.customerName,
        email,
        phone: order.customerWhatsApp,
        city: order.shippingAddress.city,
        registeredAt: new Date().toISOString(),
        orderCount: 1,
        totalSpent: order.totalAmount,
      });
    }

    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  // Inventory & Stock Adjustments
  getInventoryMovements(): InventoryMovement[] {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY_LOGS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  logInventoryMovement(entry: Omit<InventoryMovement, 'id' | 'timestamp'>) {
    const logs = this.getInventoryMovements();
    const item: InventoryMovement = {
      ...entry,
      id: 'inv-' + Date.now() + '-' + Math.floor(Math.random() * 100),
      timestamp: new Date().toISOString(),
    };
    logs.unshift(item);
    localStorage.setItem(STORAGE_KEYS.INVENTORY_LOGS, JSON.stringify(logs.slice(0, 150)));
  },

  // Coupons
  getCoupons(): Coupon[] {
    const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
      return INITIAL_COUPONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_COUPONS;
    }
  },

  validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const cleanCode = code.trim().toUpperCase();
    const coupons = this.getCoupons();
    const coupon = coupons.find((c) => c.code === cleanCode && c.isActive);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'Kode promo tidak ditemukan atau sudah tidak aktif.' };
    }

    const now = new Date().toISOString().slice(0, 10);
    if (coupon.expiryDate < now) {
      return { valid: false, discount: 0, message: 'Masa berlaku kode promo telah berakhir.' };
    }

    if (coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'Batas kuota penggunaan promo telah habis.' };
    }

    if (subtotal < coupon.minPurchase) {
      return {
        valid: false,
        discount: 0,
        message: `Minimal belanja untuk kode ini adalah ${formatRupiah(coupon.minPurchase)}.`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return {
      valid: true,
      discount: Math.min(discount, subtotal),
      message: `Kode promo "${coupon.code}" berhasil diterapkan! Hemat ${formatRupiah(discount)}`,
      coupon,
    };
  },

  saveCoupon(coupon: Partial<Coupon>): Coupon {
    const coupons = this.getCoupons();
    let saved: Coupon;
    if (coupon.id) {
      const idx = coupons.findIndex((c) => c.id === coupon.id);
      if (idx >= 0) {
        saved = { ...coupons[idx], ...coupon } as Coupon;
        coupons[idx] = saved;
      } else {
        saved = coupon as Coupon;
        coupons.push(saved);
      }
    } else {
      saved = {
        id: 'coup-' + Date.now(),
        code: (coupon.code || 'SIENCH').toUpperCase().replace(/\s+/g, ''),
        discountType: coupon.discountType || 'percentage',
        value: Number(coupon.value) || 10,
        minPurchase: Number(coupon.minPurchase) || 0,
        maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : undefined,
        expiryDate: coupon.expiryDate || '2026-12-31',
        usageLimit: Number(coupon.usageLimit) || 100,
        usedCount: 0,
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
      };
      coupons.push(saved);
    }
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    this.logAdminActivity('Coupon Saved', `Kode "${saved.code}"`);
    return saved;
  },

  deleteCoupon(id: string): boolean {
    const coupons = this.getCoupons();
    const target = coupons.find((c) => c.id === id);
    if (!target) return false;
    const filtered = coupons.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(filtered));
    this.logAdminActivity('Coupon Deleted', `Kode "${target.code}"`);
    return true;
  },

  incrementCouponUsage(code: string) {
    const clean = code.trim().toUpperCase();
    const coupons = this.getCoupons();
    const idx = coupons.findIndex((c) => c.code === clean);
    if (idx >= 0) {
      coupons[idx].usedCount += 1;
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    }
  },

  // Site Settings
  getSiteSettings(): SiteSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    try {
      return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
    } catch {
      return INITIAL_SETTINGS;
    }
  },

  updateSiteSettings(settings: Partial<SiteSettings>): SiteSettings {
    const current = this.getSiteSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(updated));
    this.logAdminActivity('Settings Updated', 'Informasi website diperbarui');
    return updated;
  },

  // Activity Logs
  getActivityLogs(): AdminActivityLog[] {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_LOGS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  logAdminActivity(action: string, details: string) {
    const logs = this.getActivityLogs();
    const session = this.getAdminSession();
    const log: AdminActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 100),
      action,
      details,
      adminEmail: session?.email || 'admin@siench.com',
      timestamp: new Date().toISOString(),
    };
    logs.unshift(log);
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_LOGS, JSON.stringify(logs.slice(0, 200)));
  },

  // Cart Management
  getCart(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveCart(items: CartItem[]) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  },

  addToCart(product: Product, quantity = 1): CartItem[] {
    const items = this.getCart();
    const existingIndex = items.findIndex((i) => i.product.id === product.id);

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({ product, quantity });
    }
    this.saveCart(items);
    return items;
  },

  updateCartQuantity(productId: string, quantity: number): CartItem[] {
    let items = this.getCart();
    if (quantity <= 0) {
      items = items.filter((i) => i.product.id !== productId);
    } else {
      const idx = items.findIndex((i) => i.product.id === productId);
      if (idx >= 0) {
        items[idx].quantity = quantity;
      }
    }
    this.saveCart(items);
    return items;
  },

  removeFromCart(productId: string): CartItem[] {
    const items = this.getCart().filter((i) => i.product.id !== productId);
    this.saveCart(items);
    return items;
  },

  clearCart() {
    localStorage.removeItem(STORAGE_KEYS.CART);
  },

  // Wishlist
  getWishlist(): string[] {
    const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    let updated: string[];
    if (exists) {
      updated = list.filter((id) => id !== productId);
    } else {
      updated = [...list, productId];
    }
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
    return !exists;
  },

  // Admin Auth Session
  getAdminSession(): { email: string; token: string; loggedInAt: string } | null {
    const data = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setAdminSession(session: { email: string; token: string; loggedInAt: string } | null) {
    if (session) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, JSON.stringify(session));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    }
  },

  // Customer Profile Session
  getUserProfile(): UserProfile | null {
    const data = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setUserProfile(user: UserProfile | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  },

  // Reset to Factory Defaults
  resetAll() {
    localStorage.clear();
    this.getProducts();
    this.getCategories();
    this.getOrders();
    this.getCoupons();
    this.getCustomers();
    this.getSiteSettings();
  },
};
