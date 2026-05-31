'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Sun, Moon, ArrowRight, Trash2, X, Plus, Minus, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useAuthStore } from '../../store/authStore';
import { useTheme } from './theme-provider';
import { INITIAL_CATEGORIES } from '../../constants/initialData';

export function Navbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const cartItems = useCartStore((state) => state.items);
  const cartTotal = useCartStore((state) => state.getCartTotal());
  const cartSubtotal = useCartStore((state) => state.getCartSubtotal());
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  
  const wishlistItems = useWishlistStore((state) => state.items);
  
  const user = useAuthStore((state) => state.user);
  const initializeAuth = useAuthStore((state) => state.initialize);

  // Initialize auth session listener
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [initializeAuth]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sync scroll class for floating navbar look
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-background/85 backdrop-blur-md border-b border-border shadow-sm py-3'
            : 'bg-background border-b border-border/40 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* 1. BRAND LOGO */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <span className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5">
                <span className="text-foreground">ZOKO</span>
                <span className="text-gold-gradient font-extrabold text-sm sm:text-base border border-accent/30 rounded px-1.5 py-0.5 bg-accent/5">
                  MALL
                </span>
              </span>
            </Link>
            
            {/* 2. INSTANT SEARCH BAR */}
            <form
              onSubmit={handleSearchSubmit}
              className="hidden md:flex flex-1 max-w-lg relative group"
            >
              <input
                type="text"
                placeholder="Search luxury tech, fashion, furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2.5 rounded-full border border-border bg-muted/30 focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-sm transition-all duration-200"
              />
              <button
                type="submit"
                className="absolute right-3.5 top-3 text-muted-foreground group-hover:text-foreground transition-colors duration-150"
              >
                <Search className="w-4.5 h-4.5" />
              </button>
            </form>

            {/* 3. NAVIGATION ACTIONS */}
            <div className="flex items-center gap-2.5 sm:gap-4 flex-shrink-0">
              
              {/* Theme Toggle Icon */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme Mode"
                className="p-2.5 rounded-full hover:bg-muted/60 transition-colors duration-150 relative text-foreground"
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5 text-accent" />
                  ) : (
                    <Moon className="w-5 h-5 text-muted-foreground" />
                  )}
                </motion.div>
              </button>

              {/* Operations Admin Dashboard Link */}
              <Link
                href="/admin"
                aria-label="Admin Dashboard"
                title="Operations Admin Dashboard"
                className="p-2.5 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-accent transition-colors duration-150"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </Link>

              {/* User Dashboard Account Link */}
              <Link
                href={user ? "/dashboard" : "/login"}
                aria-label="User Dashboard"
                className={`p-2.5 rounded-full hover:bg-muted/60 transition-colors duration-150 ${
                  user ? 'text-accent' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Wishlist Link */}
              <Link
                href="/search?wishlist=true"
                aria-label="Wishlist Items"
                className="p-2.5 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors duration-150 relative"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#111111] dark:bg-white text-white dark:text-black text-[9px] font-black flex items-center justify-center animate-bounce">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              {/* Shopping Cart Trigger */}
              <button
                onClick={() => setIsCartOpen(true)}
                aria-label="Shopping Cart Drawer"
                className="p-2.5 rounded-full hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors duration-150 relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalCartQty > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full gold-gradient text-white text-[9px] font-black flex items-center justify-center">
                    {totalCartQty}
                  </span>
                )}
              </button>

            </div>
          </div>

          {/* 4. DYNAMIC SUB-NAV BAR (10 Categories) */}
          <nav className="mt-3.5 flex items-center gap-6 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
            {INITIAL_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/search?category=${cat.slug}`}
                className="text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-accent transition-colors duration-150 flex-shrink-0"
              >
                {cat.name}
              </Link>
            ))}
          </nav>

        </div>
      </header>

      {/* ====================================================
          SLIDING GLASSMORPHIC CART DRAWER OVERLAY
          ==================================================== */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop shadow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />

            {/* Sliding Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-card border-l border-border z-50 shadow-2xl flex flex-col glass-panel"
            >
              
              {/* Drawer Header */}
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-accent" />
                  <h2 className="text-lg font-bold tracking-tight">Shopping Bag ({totalCartQty})</h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 rounded-full hover:bg-muted transition-colors duration-150 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                      <ShoppingBag className="w-8 h-8 text-muted-foreground/60" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base">Your cart is empty</h3>
                      <p className="text-sm text-muted-foreground mt-1 max-w-[240px]">
                        Save items or discover products to satisfy your daily aesthetic.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        router.push('/');
                      }}
                      className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-all duration-200"
                    >
                      Shop Collection
                    </button>
                  </div>
                ) : (
                  cartItems.map((item, idx) => {
                    const price = item.variant
                      ? (item.variant.sale_price || item.variant.price)
                      : (item.product.sale_price || item.product.price);
                    
                    return (
                      <motion.div
                        key={`${item.product.id}-${item.variant?.id || 'base'}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex gap-4 border-b border-border/50 pb-4 last:border-0"
                      >
                        {/* Image wrapper */}
                        <div className="w-20 h-20 bg-muted/40 border border-border/40 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <img
                            src={item.product.image_url}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Text descriptions */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-foreground truncate hover:text-accent">
                              <Link
                                href={`/product/${item.product.slug}`}
                                onClick={() => setIsCartOpen(false)}
                              >
                                {item.product.name}
                              </Link>
                            </h4>
                            
                            {/* Variant attributes descriptors */}
                            {item.variant && (
                              <p className="text-xs text-muted-foreground mt-0.5 flex flex-wrap gap-x-2">
                                {Object.entries(item.variant.attributes).map(([key, val]) => (
                                  <span key={key}>
                                    <strong>{key}:</strong> {val}
                                  </span>
                                ))}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controllers */}
                            <div className="flex items-center border border-border rounded-full overflow-hidden bg-background">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.variant?.id)}
                                className="p-1 px-2.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-xs font-bold px-1.5 min-w-[20px] text-center select-none">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.variant?.id)}
                                className="p-1 px-2.5 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Price and deletion */}
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-black">
                                ₦{(price * item.quantity).toLocaleString()}
                              </span>
                              <button
                                onClick={() => removeItem(item.product.id, item.variant?.id)}
                                className="text-muted-foreground hover:text-destructive p-1 rounded-full hover:bg-muted/80 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                          </div>
                        </div>

                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer Checkout Calculations */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-border bg-muted/20 space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-semibold text-foreground">₦{cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold text-foreground border-t border-border/50 pt-2">
                      <span>Estimated Total</span>
                      <span className="text-gold-gradient font-black">₦{cartTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsCartOpen(false);
                      router.push('/checkout');
                    }}
                    className="w-full py-3.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-widest hover:brightness-95 active:scale-98 transition-all duration-150 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Secure Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
