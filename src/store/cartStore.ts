import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  sale_price?: number;
  discount?: number;
  image_url?: string;
  images?: string[];
  inventory: number;
  brand?: string;
  category?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  price: number;
  sale_price?: number;
  inventory: number;
  attributes: Record<string, string>;
}

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
}

interface CartStore {
  items: CartItem[];
  coupon: Coupon | null;
  shippingCost: number;
  taxRate: number; // e.g. 0.075 for 7.5%
  
  addItem: (product: Product, quantity?: number, variant?: ProductVariant) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  
  // Computed values getters
  getCartSubtotal: () => number;
  getCartDiscount: () => number;
  getCartTax: () => number;
  getCartTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      shippingCost: 2000, // Default Standard Shipping Cost in ₦
      taxRate: 0.075, // 7.5% Standard VAT
      
      addItem: (product, quantity = 1, variant) => {
        const currentItems = get().items;
        const targetPrice = variant ? (variant.sale_price || variant.price) : (product.sale_price || product.price);
        
        // Find match by product id and variant id (if variant exists)
        const existingItemIndex = currentItems.findIndex(
          (item) => 
            item.product.id === product.id && 
            (!variant || item.variant?.id === variant.id)
        );

        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          const newQty = updatedItems[existingItemIndex].quantity + quantity;
          const maxStock = variant ? variant.inventory : product.inventory;
          
          updatedItems[existingItemIndex].quantity = Math.min(newQty, maxStock);
          set({ items: updatedItems });
        } else {
          set({ items: [...currentItems, { product, quantity, variant }] });
        }
      },
      
      removeItem: (productId, variantId) => {
        set({
          items: get().items.filter(
            (item) => !(item.product.id === productId && (!variantId || item.variant?.id === variantId))
          ),
        });
      },
      
      updateQuantity: (productId, quantity, variantId) => {
        const currentItems = get().items;
        const existingItemIndex = currentItems.findIndex(
          (item) => 
            item.product.id === productId && 
            (!variantId || item.variant?.id === variantId)
        );
        
        if (existingItemIndex > -1) {
          const updatedItems = [...currentItems];
          const maxStock = updatedItems[existingItemIndex].variant 
            ? updatedItems[existingItemIndex].variant!.inventory 
            : updatedItems[existingItemIndex].product.inventory;
            
          updatedItems[existingItemIndex].quantity = Math.max(1, Math.min(quantity, maxStock));
          set({ items: updatedItems });
        }
      },
      
      clearCart: () => set({ items: [], coupon: null }),
      
      applyCoupon: async (code) => {
        const subtotal = get().getCartSubtotal();
        const codeUpper = code.toUpperCase();
        
        // Simulate remote validation or handle static validated promo codes
        if (codeUpper === 'WELCOME100') {
          if (subtotal < 10000) {
            return { success: false, message: 'Minimum order value of ₦10,000 required for this coupon.' };
          }
          const coupon: Coupon = {
            code: 'WELCOME100',
            discountType: 'percentage',
            discountValue: 10,
          };
          set({ coupon });
          return { success: true, message: '10% Discount applied successfully!' };
        }
        
        if (codeUpper === 'ZOKOLUXURY') {
          if (subtotal < 50000) {
            return { success: false, message: 'Minimum order value of ₦50,000 required for this coupon.' };
          }
          const coupon: Coupon = {
            code: 'ZOKOLUXURY',
            discountType: 'fixed',
            discountValue: 5000,
          };
          set({ coupon });
          return { success: true, message: '₦5,000 Discount applied successfully!' };
        }

        if (codeUpper === 'FREESHIPNGR') {
          if (subtotal < 25000) {
            return { success: false, message: 'Minimum order value of ₦25,000 required for this coupon.' };
          }
          set({ shippingCost: 0, coupon: { code: 'FREESHIPNGR', discountType: 'fixed', discountValue: 0 } });
          return { success: true, message: 'Free Shipping applied successfully!' };
        }
        
        return { success: false, message: 'Invalid or expired coupon code.' };
      },
      
      removeCoupon: () => set({ coupon: null, shippingCost: 2000 }),
      
      getCartSubtotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.variant 
            ? (item.variant.sale_price || item.variant.price) 
            : (item.product.sale_price || item.product.price);
          return total + (price * item.quantity);
        }, 0);
      },
      
      getCartDiscount: () => {
        const subtotal = get().getCartSubtotal();
        const coupon = get().coupon;
        if (!coupon) return 0;
        
        if (coupon.discountType === 'percentage') {
          return (subtotal * coupon.discountValue) / 100;
        } else {
          return coupon.discountValue;
        }
      },
      
      getCartTax: () => {
        const subtotal = get().getCartSubtotal();
        const discount = get().getCartDiscount();
        const taxRate = get().taxRate;
        return Math.max(0, (subtotal - discount) * taxRate);
      },
      
      getCartTotal: () => {
        const subtotal = get().getCartSubtotal();
        const discount = get().getCartDiscount();
        const tax = get().getCartTax();
        const shipping = get().shippingCost;
        return Math.max(0, subtotal - discount + tax + shipping);
      },
    }),
    {
      name: 'zoko-cart-storage',
      skipHydration: false,
    }
  )
);
