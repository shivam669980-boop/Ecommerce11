import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS } from '../constants/initialData';
import type { DetailedProduct, Category, Brand } from '../constants/initialData';
export type { DetailedProduct, Category, Brand };

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  title: string;
  comment: string;
  created_at: string;
}

export interface Order {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  items: {
    product_name: string;
    product_image: string;
    price: number;
    quantity: number;
    variant_attributes?: Record<string, string>;
  }[];
  address: {
    name: string;
    street: string;
    city: string;
    state: string;
    phone: string;
  };
  payment_method: string;
  created_at: string;
}

// Local mock database helpers
const getLocalData = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalData = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error writing localStorage key "${key}":`, error);
  }
};

export const dbService = {
  // 1. CATEGORIES & BRANDS
  async getCategories(): Promise<Category[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('categories').select('*');
      if (!error && data) return data as Category[];
    }
    return INITIAL_CATEGORIES;
  },

  async getBrands(): Promise<Brand[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('brands').select('*');
      if (!error && data) return data as Brand[];
    }
    return INITIAL_BRANDS;
  },

  // 2. PRODUCT CATALOG OPERATIONS
  async getProducts(params?: {
    category?: string;
    brand?: string;
    search?: string;
    priceRange?: [number, number];
    rating?: number;
    sort?: string;
  }): Promise<DetailedProduct[]> {
    if (isSupabaseConfigured()) {
      let query = supabase!.from('products').select(`
        *,
        categories (name, slug),
        brands (name, slug),
        product_images (*)
      `).eq('status', 'active');

      if (params?.category) {
        // Assume category slug is supplied
        const { data: cat } = await supabase!.from('categories').select('id').eq('slug', params.category).single();
        if (cat) query = query.eq('category_id', cat.id);
      }
      if (params?.brand) {
        const { data: br } = await supabase!.from('brands').select('id').eq('slug', params.brand).single();
        if (br) query = query.eq('brand_id', br.id);
      }
      if (params?.search) {
        query = query.ilike('name', `%${params.search}%`);
      }
      if (params?.priceRange) {
        query = query.gte('price', params.priceRange[0]).lte('price', params.priceRange[1]);
      }
      if (params?.rating) {
        query = query.gte('rating', params.rating);
      }

      // Sort bindings
      if (params?.sort) {
        if (params.sort === 'price-asc') query = query.order('price', { ascending: true });
        else if (params.sort === 'price-desc') query = query.order('price', { ascending: false });
        else if (params.sort === 'rating') query = query.order('rating', { ascending: false });
        else if (params.sort === 'newest') query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;
      if (!error && data) {
        // Map to DetailedProduct standard
        return data.map((p: any) => ({
          ...p,
          brand: p.brands?.name || 'Generic',
          category: p.categories?.name || 'Uncategorized',
          image_url: p.product_images?.find((img: any) => img.is_primary)?.url || p.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600',
          images: p.product_images?.map((img: any) => img.url) || [],
          options: typeof p.options === 'string' ? JSON.parse(p.options) : p.options || [],
          specifications: p.specifications || { 'Origin': 'Imported' },
          faqs: p.faqs || []
        }));
      }
    }

    // Local Mock Mode filtering
    let products = [...INITIAL_PRODUCTS];

    if (params?.category) {
      products = products.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
    }
    if (params?.brand) {
      products = products.filter(p => p.brand.toLowerCase() === params.brand!.toLowerCase());
    }
    if (params?.search) {
      const q = params.search.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (params?.priceRange) {
      products = products.filter(p => {
        const currentPrice = p.sale_price || p.price;
        return currentPrice >= params.priceRange![0] && currentPrice <= params.priceRange![1];
      });
    }
    if (params?.rating) {
      products = products.filter(p => p.rating >= params.rating!);
    }

    // Sort mappings
    if (params?.sort) {
      if (params.sort === 'price-asc') {
        products.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
      } else if (params.sort === 'price-desc') {
        products.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
      } else if (params.sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else if (params.sort === 'newest') {
        // Mock ID bases
        products.reverse();
      }
    }

    return products;
  },

  async getProductBySlug(slug: string): Promise<DetailedProduct | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('products').select(`
        *,
        categories (name, slug),
        brands (name, slug),
        product_images (*),
        product_variants (*)
      `).eq('slug', slug).single();

      if (!error && data) {
        return {
          ...data,
          brand: data.brands?.name || 'Generic',
          category: data.categories?.name || 'Uncategorized',
          image_url: data.product_images?.find((img: any) => img.is_primary)?.url || data.image_url,
          images: data.product_images?.map((img: any) => img.url) || [],
          options: data.options || [],
          variants: data.product_variants || [],
          specifications: data.specifications || {
            'Display Quality': 'High resolution dynamic panel',
            'Material Core': 'Tempered metal blend',
            'Warranty Period': '1 Year limited warranty'
          },
          faqs: data.faqs || [
            { q: 'Is shipping free in Lagos?', a: 'Yes! All orders over ₦25,000 qualify for completely free logistics delivery.' }
          ]
        } as DetailedProduct;
      }
    }

    const matched = INITIAL_PRODUCTS.find(p => p.slug === slug);
    return matched || null;
  },

  // 3. PRODUCT REVIEWS & SOCIALS
  async getReviews(productId: string): Promise<Review[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('reviews').select('*').eq('product_id', productId).order('created_at', { ascending: false });
      if (!error && data) return data as Review[];
    }

    // Local Storage Mock Reviews
    const allMockReviews = getLocalData<Review[]>('zoko_mock_reviews', [
      { id: 'rev-1', product_id: productId, user_name: 'Obinna K.', rating: 5, title: 'Incredibly Premium!', comment: 'This product feels like pure luxury. Excellent quality material and high-speed delivery to Abuja.', created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { id: 'rev-2', product_id: productId, user_name: 'Chioma A.', rating: 4, title: 'Very Solid Purchase', comment: 'Looks absolutely premium. The packaging feels like Apple level details.', created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() }
    ]);

    return allMockReviews.filter(r => r.product_id === productId);
  },

  async addReview(productId: string, rating: number, title: string, comment: string, userName: string): Promise<Review> {
    const newReview: Review = {
      id: `rev-${Math.random().toString(36).substr(2, 9)}`,
      product_id: productId,
      user_name: userName,
      rating,
      title,
      comment,
      created_at: new Date().toISOString()
    };

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('reviews').insert({
        product_id: productId,
        rating,
        title,
        comment,
        user_name: userName
      }).select().single();

      if (!error && data) return data as Review;
    }

    // Save in Local Storage Simulation
    const currentMockReviews = getLocalData<Review[]>('zoko_mock_reviews', []);
    currentMockReviews.unshift(newReview);
    setLocalData('zoko_mock_reviews', currentMockReviews);

    return newReview;
  },

  // 4. USER ORDER SYSTEMS
  async submitOrder(orderData: {
    items: any[];
    address: any;
    paymentMethod: string;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  }): Promise<{ success: boolean; orderId: string; message: string }> {
    const orderId = `ZKO-${Math.floor(100000 + Math.random() * 900000)}`;

    if (isSupabaseConfigured()) {
      try {
        // Place core order
        const { data: order, error: orderErr } = await supabase!.from('orders').insert({
          subtotal: orderData.subtotal,
          tax: orderData.tax,
          shipping: orderData.shipping,
          total: orderData.total,
          status: 'processing'
        }).select().single();

        if (orderErr || !order) throw new Error(orderErr?.message || 'Order creation failed');

        // Add line items
        const lineItems = orderData.items.map(item => ({
          order_id: order.id,
          product_id: item.product.id,
          variant_id: item.variant?.id || null,
          quantity: item.quantity,
          price: item.variant ? (item.variant.sale_price || item.variant.price) : (item.product.sale_price || item.product.price)
        }));

        const { error: itemsErr } = await supabase!.from('order_items').insert(lineItems);
        if (itemsErr) throw new Error(itemsErr.message);

        // Add payment trace
        await supabase!.from('payments').insert({
          order_id: order.id,
          payment_method: orderData.paymentMethod,
          transaction_id: `txn_${Math.random().toString(36).substr(2, 12)}`,
          status: 'succeeded',
          amount: orderData.total
        });

        return { success: true, orderId: order.id, message: 'Order placed successfully!' };
      } catch (err: any) {
        return { success: false, orderId: '', message: err.message || 'Database error occurred during order write.' };
      }
    }

    // Local Storage Mock Checkout
    const mockOrders = getLocalData<Order[]>('zoko_mock_orders', []);
    const newMockOrder: Order = {
      id: orderId,
      status: 'processing',
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      shipping: orderData.shipping,
      total: orderData.total,
      items: orderData.items.map(item => ({
        product_name: item.product.name,
        product_image: item.product.image_url,
        price: item.variant ? (item.variant.sale_price || item.variant.price) : (item.product.sale_price || item.product.price),
        quantity: item.quantity,
        variant_attributes: item.variant?.attributes || undefined
      })),
      address: orderData.address,
      payment_method: orderData.paymentMethod,
      created_at: new Date().toISOString()
    };

    mockOrders.unshift(newMockOrder);
    setLocalData('zoko_mock_orders', mockOrders);

    return { success: true, orderId, message: 'Simulated Order Settled Successfully!' };
  },

  async getUserOrders(): Promise<Order[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.from('orders').select(`
        *,
        order_items (
          *,
          products (name, image_url)
        )
      `).order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((o: any) => ({
          id: o.id,
          status: o.status,
          subtotal: o.subtotal,
          tax: o.tax,
          shipping: o.shipping,
          total: o.total,
          items: o.order_items.map((i: any) => ({
            product_name: i.products?.name || 'Product',
            product_image: i.products?.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600',
            price: i.price,
            quantity: i.quantity
          })),
          address: { name: 'Customer', street: 'Street Address', city: 'City', state: 'State', phone: '08000000000' },
          payment_method: 'Card Payment',
          created_at: o.created_at
        }));
      }
    }
    return getLocalData<Order[]>('zoko_mock_orders', []);
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<{ success: boolean; message: string }> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase!.from('orders').update({ status }).eq('id', orderId);
      if (error) return { success: false, message: error.message };
      return { success: true, message: `Order status updated to ${status} in Supabase.` };
    }

    // Local Storage Mock Order status update
    const mockOrders = getLocalData<Order[]>('zoko_mock_orders', []);
    const updated = mockOrders.map(o => o.id === orderId ? { ...o, status } : o);
    setLocalData('zoko_mock_orders', updated);
    return { success: true, message: `Simulated order status updated to ${status}.` };
  },

  // 5. ENTERPRISE ADMIN ANALYTICS METRICS
  async getAdminMetrics(): Promise<{
    kpis: { title: string; value: string; change: string; icon: string }[];
    revenueData: { name: string; revenue: number; orders: number }[];
    productSales: { name: string; value: number }[];
    userGrowth: { name: string; customers: number }[];
  }> {
    // Generate dates for labels
    const getPastDateLabel = (daysAgo: number) => {
      const d = new Date();
      d.setDate(d.getDate() - daysAgo);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Synthesize beautiful statistics based on 100 products catalog
    const mockOrders = getLocalData<Order[]>('zoko_mock_orders', []);
    const ordersCount = mockOrders.length + 314;
    const mockTotalRevenue = mockOrders.reduce((sum, o) => sum + o.total, 0);
    const totalRevenueSum = mockTotalRevenue + 24890000;

    return {
      kpis: [
        { title: 'Total Revenue', value: `₦${(totalRevenueSum).toLocaleString()}`, change: '+14.2% from last month', icon: 'DollarSign' },
        { title: 'Completed Orders', value: ordersCount.toString(), change: '+8.3% from last week', icon: 'ShoppingBag' },
        { title: 'Active Products', value: INITIAL_PRODUCTS.length.toString(), change: '10 Categories Online', icon: 'Package' },
        { title: 'Registered Users', value: '1,424', change: '+22.4% new accounts', icon: 'Users' }
      ],
      revenueData: [
        { name: getPastDateLabel(6), revenue: 2400000, orders: 12 },
        { name: getPastDateLabel(5), revenue: 3100000, orders: 16 },
        { name: getPastDateLabel(4), revenue: 2800000, orders: 14 },
        { name: getPastDateLabel(3), revenue: 4200000, orders: 22 },
        { name: getPastDateLabel(2), revenue: 3900000, orders: 19 },
        { name: getPastDateLabel(1), revenue: 5100000, orders: 26 },
        { name: 'Today', revenue: (mockTotalRevenue + 4500000), orders: (mockOrders.length + 20) }
      ],
      productSales: [
        { name: 'Smartphones', value: 45 },
        { name: 'Laptops', value: 30 },
        { name: 'Electronics', value: 15 },
        { name: 'Fashion & Shoes', value: 10 }
      ],
      userGrowth: [
        { name: 'Week 1', customers: 850 },
        { name: 'Week 2', customers: 1020 },
        { name: 'Week 3', customers: 1240 },
        { name: 'Week 4', customers: 1424 }
      ]
    };
  }
};
