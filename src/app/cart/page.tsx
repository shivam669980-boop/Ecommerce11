'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Trash2, ArrowRight, Sparkles, Percent, Plus, Minus, Tag, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';

export default function CartPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.getCartTotal());
  const cartSubtotal = useCartStore((state) => state.getCartSubtotal());
  const cartDiscount = useCartStore((state) => state.getCartDiscount());
  const cartTax = useCartStore((state) => state.getCartTax());
  const shippingCost = useCartStore((state) => state.shippingCost);
  const coupon = useCartStore((state) => state.coupon);
  
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      const res = await applyCoupon(couponCode.trim());
      if (res.success) {
        setCouponMsg({ type: 'success', text: res.message });
        setCouponCode('');
      } else {
        setCouponMsg({ type: 'error', text: res.message });
      }
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMsg(null);
  };

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title */}
      <div className="mb-10 text-left">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">Your Shopping Bag</h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
          Review your items, apply promotional coupon codes, and settle terms.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="max-w-lg mx-auto bg-card border border-border p-16 rounded-3xl text-center space-y-6 shadow-sm glass-panel">
          <div className="w-20 h-20 bg-muted/50 flex items-center justify-center rounded-full mx-auto">
            <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg">Your shopping bag is empty</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
              Save products to your wishlist or discover premium items across our categories.
            </p>
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-widest hover:brightness-105 transition-all"
          >
            Explore Collections
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ====================================================
              A. CART ITEMS LIST (LEFT COLUMN - 8 SPACES)
              ==================================================== */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item, idx) => {
              const price = item.variant
                ? (item.variant.sale_price || item.variant.price)
                : (item.product.sale_price || item.product.price);
              
              return (
                <motion.div
                  key={`${item.product.id}-${item.variant?.id || 'base'}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card border border-border/60 hover:border-accent/30 p-5 rounded-2xl flex flex-col sm:flex-row gap-4 items-center justify-between shadow-sm transition-all duration-300 relative group overflow-hidden"
                >
                  <div className="flex gap-4 items-center w-full sm:w-auto">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 bg-muted/20 border border-border/40 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>

                    {/* Meta descriptions */}
                    <div className="text-left space-y-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">{item.product.brand}</p>
                      <h3 className="text-sm sm:text-base font-bold text-foreground line-clamp-1 hover:text-accent">
                        <Link href={`/product/${item.product.slug}`}>{item.product.name}</Link>
                      </h3>
                      
                      {item.variant && (
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3">
                          {Object.entries(item.variant.attributes).map(([key, val]) => (
                            <span key={key}>
                              <strong>{key}:</strong> {val}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs font-black text-foreground sm:hidden pt-1">
                        ₦{price.toLocaleString()} x {item.quantity}
                      </p>
                    </div>
                  </div>

                  {/* Quantity and Price controllers */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t border-border/40 sm:border-0 pt-3 sm:pt-0">
                    
                    {/* Quantity Selector buttons */}
                    <div className="flex items-center border border-border rounded-full overflow-hidden bg-background">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                        className="p-1 px-3.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black px-2 min-w-[24px] text-center select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                        className="p-1 px-3.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Total balance and delete */}
                    <div className="flex items-center gap-4">
                      <div className="text-right min-w-[100px]">
                        <span className="text-base font-black text-foreground">
                          ₦{(price * item.quantity).toLocaleString()}
                        </span>
                        <p className="text-[10px] text-muted-foreground">₦{price.toLocaleString()} each</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id, item.variant?.id)}
                        className="text-muted-foreground hover:text-destructive p-2 rounded-full hover:bg-muted/80 transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </div>

          {/* ====================================================
              B. ORDER SUMMARY SIDEBAR (RIGHT COLUMN - 4 SPACES)
              ==================================================== */}
          <aside className="lg:col-span-4 space-y-6 sticky top-28">
            
            {/* Coupon Panel */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm glass-panel text-left space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-accent" />
                <span>Apply Promo Coupon</span>
              </h3>

              {coupon ? (
                <div className="bg-accent/10 border border-accent/20 rounded-xl p-3.5 flex items-center justify-between text-xs text-accent font-bold">
                  <div className="flex items-center gap-1.5">
                    <Percent className="w-4.5 h-4.5" />
                    <span>Coupon Applied: "{coupon.code}"</span>
                  </div>
                  <button onClick={handleRemoveCoupon} className="p-0.5 rounded-full hover:bg-accent/20 text-accent">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="WELCOM100..."
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 border border-border bg-background rounded-xl p-2.5 text-xs focus:ring-accent"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl border border-primary/20 bg-secondary text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMsg && (
                <p className={`text-[10px] font-bold ${couponMsg.type === 'success' ? 'text-accent' : 'text-destructive'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* General Calculations */}
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm glass-panel text-left space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Order Summary</span>
              </h3>

              <div className="space-y-3.5 border-b border-border/50 pb-4 text-sm font-semibold">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₦{cartSubtotal.toLocaleString()}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-accent">
                    <span>Discount Deducted</span>
                    <span>-₦{cartDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dynamic VAT (7.5%)</span>
                  <span className="text-foreground">₦{cartTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nationwide Logistics</span>
                  <span className="text-foreground">
                    {shippingCost === 0 ? 'FREE' : `₦${shippingCost.toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Total Balance */}
              <div className="flex justify-between items-baseline pt-1.5">
                <span className="text-base font-bold text-foreground">Grand Total</span>
                <span className="text-2xl font-black text-gold-gradient">
                  ₦{cartTotal.toLocaleString()}
                </span>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full py-4 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-widest hover:brightness-95 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </button>

              <div className="pt-2 text-center text-[10px] text-muted-foreground">
                Refund Protection guaranteed on authenticated goods. Settle safely.
              </div>

            </div>

          </aside>

        </div>
      )}

    </div>
  );
}
