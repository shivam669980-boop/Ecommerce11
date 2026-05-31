'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, Heart, Sparkles, TrendingUp, ShieldCheck, Award, Zap, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS, DetailedProduct } from '../constants/initialData';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

// Hero slides definitions
const HERO_SLIDES = [
  {
    title: 'The Platinum Standard of Tech',
    subtitle: 'MacBook Pro & iPhone 16 Pro Max now online',
    description: 'Experience Apple intelligence matched with custom titanium structures and the revolutionary M4 processors.',
    btnText: 'Experience Flagships',
    link: '/search?brand=apple',
    bgImg: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400',
    tag: 'LIMITED RELEASE'
  },
  {
    title: 'Acoustic Perfection Redefined',
    subtitle: 'Sony High-Fidelity Audio Series',
    description: 'Immerse yourself inside industry-leading active noise cancellation (ANC) and 7.1.2 home theater acoustics.',
    btnText: 'Hear The Absolute',
    link: '/search?brand=sony',
    bgImg: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400',
    tag: '50% FLASH DISCOUNT'
  },
  {
    title: 'Scandinavian Living Spaces',
    subtitle: 'IKEA Modular Wooden Furniture',
    description: 'Curate your workspace, bedroom, and dining zone with elegant oak veneer structures and modular libraries.',
    btnText: 'Redesign Home',
    link: '/search?brand=ikea',
    bgImg: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1400',
    tag: 'VIP GROUND DELIVERIES'
  }
];

const TESTIMONIALS = [
  { name: 'Dr. Tunde O.', role: 'Enterprise Solution Lead', comment: 'The delivery speed and packaging details are absolute top-tier. Buying a MacBook Pro was smooth and completely secure.', rating: 5 },
  { name: 'Aminat Y.', role: 'Creative Designer', comment: 'I was blown away by the website aesthetics! The transition flows are beautiful, and adding items to the cart feels incredibly slick.', rating: 5 },
  { name: 'Emeka U.', role: 'Professional Athlete', comment: 'Highly dynamic options selector! Toggling colors and sizes of Nike Jordan 1 was extremely responsive. Highly recommended.', rating: 5 }
];

export default function HomePage() {
  const router = useRouter();
  const [heroIndex, setHeroIndex] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const hasInWishlist = useWishlistStore((state) => state.hasItem);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleNextHero = () => {
    setHeroIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const handlePrevHero = () => {
    setHeroIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Dynamically segment our 100 products into six lists of exactly 10 products
  const trendingProducts = INITIAL_PRODUCTS.slice(0, 10);
  const bestSellers = INITIAL_PRODUCTS.slice(10, 20);
  const newArrivals = INITIAL_PRODUCTS.slice(20, 30);
  const flashDeals = INITIAL_PRODUCTS.slice(30, 40);
  const mostViewed = INITIAL_PRODUCTS.slice(40, 50);
  const recommendedProducts = INITIAL_PRODUCTS.slice(50, 60);

  // Render unified premium product slider section
  const renderProductFeed = (title: string, subtitle: string, products: DetailedProduct[], badge?: string) => (
    <section className="py-12 border-b border-border/50 last:border-0">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            {badge && (
              <span className="bg-accent/10 border border-accent/20 rounded px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-accent flex items-center gap-1">
                <Zap className="w-3 h-3 fill-accent" />
                <span>{badge}</span>
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground">{title}</h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Link 
          href="/search" 
          className="text-xs font-bold text-accent hover:text-accent/80 transition-colors duration-150 flex items-center gap-1 group flex-shrink-0"
        >
          <span>See All</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((p) => {
          const discountVal = p.discount ? Math.round(p.discount) : 0;
          const isSaved = hasInWishlist(p.id);
          const currentPrice = p.sale_price || p.price;
          
          return (
            <motion.div
              key={p.id}
              whileHover={{ y: -6 }}
              className="bg-card border border-border/60 hover:border-accent/40 rounded-2xl p-3.5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden"
            >
              {/* Discount Tag */}
              {discountVal > 0 && (
                <span className="absolute top-3.5 left-3.5 z-10 bg-destructive/10 border border-destructive/20 text-destructive text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  -{discountVal}% Off
                </span>
              )}

              {/* Wishlist toggle absolute */}
              <button
                onClick={() => toggleWishlist(p)}
                className={`absolute top-3.5 right-3.5 z-10 p-1.5 rounded-full border transition-all duration-150 ${
                  isSaved
                    ? 'bg-accent/15 border-accent/30 text-accent'
                    : 'bg-background/80 border-border/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-accent' : ''}`} />
              </button>

              {/* Image box */}
              <Link href={`/product/${p.slug}`} className="block w-full aspect-square bg-muted/30 rounded-xl overflow-hidden mb-4 relative">
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              {/* Details and Actions */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1.5">{p.brand}</p>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 hover:text-accent transition-colors mb-1.5">
                    <Link href={`/product/${p.slug}`}>{p.name}</Link>
                  </h3>
                  
                  {/* Rating indicator */}
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-3 h-3 fill-accent text-accent" />
                    <span className="text-[10.5px] font-extrabold">{p.rating.toFixed(1)}</span>
                    <span className="text-[9.5px] text-muted-foreground">({p.reviews_count})</span>
                  </div>
                </div>

                <div className="mt-2">
                  <div className="flex items-baseline gap-1.5 mb-3">
                    <span className="text-sm font-black text-foreground">₦{currentPrice.toLocaleString()}</span>
                    {p.sale_price && (
                      <span className="text-[11px] text-muted-foreground line-through">₦{p.price.toLocaleString()}</span>
                    )}
                  </div>

                  <button
                    onClick={() => addItem(p)}
                    className="w-full py-2.5 rounded-xl border border-primary/10 hover:border-accent bg-secondary hover:bg-accent hover:text-black text-xs font-black uppercase tracking-widest transition-all duration-200"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>
    </section>
  );

  return (
    <div className="w-full pb-16">
      
      {/* ====================================================
          1. MEGA HERO BANNER CAROUSEL
          ==================================================== */}
      <section className="w-full relative h-[420px] sm:h-[500px] lg:h-[580px] bg-black overflow-hidden z-10">
        
        {/* Backdrop Slide Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.75, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 bg-cover bg-center select-none pointer-events-none"
            style={{ backgroundImage: `url(${HERO_SLIDES[heroIndex].bgImg})` }}
          />
        </AnimatePresence>

        {/* Backdrop Overlay shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 pointer-events-none" />

        {/* Navigation buttons */}
        <button
          onClick={handlePrevHero}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-white/20 bg-black/40 text-white hover:bg-accent hover:text-black z-20 transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextHero}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-white/20 bg-black/40 text-white hover:bg-accent hover:text-black z-20 transition-all active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Info Box Content Grid */}
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 relative z-20 flex flex-col justify-center">
          <div className="max-w-xl space-y-6">
            
            {/* Tag alert */}
            <motion.span
              key={`tag-${heroIndex}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-block bg-accent/20 border border-accent/40 rounded px-3 py-1 text-[10px] font-black uppercase tracking-widest text-accent"
            >
              {HERO_SLIDES[heroIndex].tag}
            </motion.span>

            {/* Title headers */}
            <div className="space-y-2">
              <motion.p
                key={`sub-${heroIndex}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gold-gradient text-sm sm:text-base font-black uppercase tracking-wider"
              >
                {HERO_SLIDES[heroIndex].subtitle}
              </motion.p>
              <motion.h1
                key={`title-${heroIndex}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight"
              >
                {HERO_SLIDES[heroIndex].title}
              </motion.h1>
            </div>

            {/* Descriptor */}
            <motion.p
              key={`desc-${heroIndex}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-xs sm:text-sm text-zinc-300 max-w-md leading-relaxed"
            >
              {HERO_SLIDES[heroIndex].description}
            </motion.p>

            {/* CTA action */}
            <motion.div
              key={`cta-${heroIndex}`}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-2"
            >
              <Link
                href={HERO_SLIDES[heroIndex].link}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full gold-gradient hover:brightness-105 active:scale-98 transition-all duration-150 text-white text-xs font-black uppercase tracking-widest shadow-xl"
              >
                <span>{HERO_SLIDES[heroIndex].btnText}</span>
                <ArrowRight className="w-4 h-4 text-white" />
              </Link>
            </motion.div>

          </div>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setHeroIndex(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                heroIndex === i ? 'bg-accent w-8' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

      </section>

      {/* ====================================================
          2. FEATURED CATEGORIES (MIN 10 CATEGORIES)
          ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-border/50">
        <div className="text-center max-w-lg mx-auto mb-10">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground uppercase">Shop by Boutique Catalog</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Explore our 10 curated luxury categories crafted to cover all your requirements.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {INITIAL_CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.id}
              whileHover={{ scale: 1.02 }}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="group aspect-video sm:aspect-square relative rounded-2xl overflow-hidden border border-border/50 bg-black cursor-pointer shadow-sm"
              onClick={() => router.push(`/search?category=${cat.slug}`)}
            >
              {/* Back photo */}
              <img
                src={cat.image_url}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
              />
              {/* Overlay shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Title anchors */}
              <div className="absolute bottom-4 left-4 right-4 text-left">
                <span className="inline-block bg-accent/20 border border-accent/30 rounded px-1.5 py-0.5 text-[8.5px] font-black uppercase tracking-widest text-accent mb-1.5">
                  BOUTIQUE
                </span>
                <h3 className="text-sm font-black text-white tracking-wide uppercase line-clamp-1">{cat.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ====================================================
          3. SIX RELIABLE PRODUCT FEEDS (EXACTLY 10 PRODUCTS EACH)
          ==================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        
        {/* Feed A: Trending Products (10) */}
        {renderProductFeed('Trending Products', 'The most in-demand products right now', trendingProducts, 'DEMAND INDEX HIGH')}

        {/* Feed B: Best Sellers (10) */}
        {renderProductFeed('Best Sellers', 'Customer favorites with highest sales volumes', bestSellers, 'POPULARITY PEAK')}

        {/* Feed C: New Arrivals (10) */}
        {renderProductFeed('New Arrivals', 'Fresh flagship releases curated this week', newArrivals, 'JUST IN')}

        {/* Feed D: Flash Deals (10) */}
        {renderProductFeed('Flash Deals', 'Limited-time special price markdowns', flashDeals, 'PRICE CLEARANCE')}

        {/* Feed E: Most Viewed Products (10) */}
        {renderProductFeed('Most Viewed', 'Highest volume traffic items today', mostViewed, 'TRAFFIC PEAK')}

        {/* Feed F: Recommended Products (10) */}
        {renderProductFeed('Recommended for You', 'Personalized calculations tailored to your tastes', recommendedProducts, 'VIP CHOICE')}

      </div>

      {/* ====================================================
          4. BRAND PARTNER CAROUSEL
          ==================================================== */}
      <section className="w-full py-16 bg-muted/20 border-t border-b border-border/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-8">
            DIRECT DIRECT DISTRIBUTION CHANNELS
          </p>
          <div className="flex justify-around items-center gap-8 flex-wrap opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
            {INITIAL_BRANDS.map((br) => (
              <div key={br.id} className="flex flex-col items-center select-none cursor-pointer hover:scale-105 transition-transform" onClick={() => router.push(`/search?brand=${br.slug}`)}>
                <span className="text-base sm:text-lg font-black tracking-tight text-foreground">{br.name}</span>
                <span className="text-[8px] tracking-wider text-accent font-bold mt-0.5">VERIFIED</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================
          5. STATISTICS GRIDS
          ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center border-b border-border/50">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div className="space-y-1.5 p-6 border border-border/40 rounded-2xl bg-card shadow-sm">
            <TrendingUp className="w-8 h-8 text-accent mx-auto" />
            <h3 className="text-3xl font-black tracking-tight text-foreground text-gold-gradient">₦2.4B+</h3>
            <p className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">Transaction Value Settled</p>
          </div>
          <div className="space-y-1.5 p-6 border border-border/40 rounded-2xl bg-card shadow-sm">
            <ShieldCheck className="w-8 h-8 text-accent mx-auto" />
            <h3 className="text-3xl font-black tracking-tight text-foreground">100%</h3>
            <p className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">Safe Paystack & SSL Encrypted</p>
          </div>
          <div className="space-y-1.5 p-6 border border-border/40 rounded-2xl bg-card shadow-sm">
            <Award className="w-8 h-8 text-accent mx-auto" />
            <h3 className="text-3xl font-black tracking-tight text-foreground">10/10</h3>
            <p className="text-xs uppercase font-extrabold tracking-wider text-muted-foreground">Premium Authenticated Brands</p>
          </div>
        </div>
      </section>

      {/* ====================================================
          6. TESTIMONIAL CAROUSEL
          ==================================================== */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-[10px] font-black tracking-widest text-accent uppercase mb-3">TRUST & SECURITY</p>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-8">What our VIP Customers Say</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="p-6 border border-border/50 rounded-2xl bg-card text-left space-y-4 shadow-sm relative">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-accent" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground italic leading-relaxed">
                "{t.comment}"
              </p>
              <div>
                <h4 className="text-xs font-bold text-foreground">{t.name}</h4>
                <span className="text-[10px] text-muted-foreground font-medium">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          7. STANDALONE PROMO ACTION BANNER
          ==================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full gold-gradient rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
          {/* Subtle inner shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-12 translate-x-12 filter blur-md" />
          
          <div className="max-w-xl mx-auto space-y-6 relative z-10">
            <span className="inline-block bg-white/20 border border-white/30 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">
              LIMITED FIRST SIGNUP BONUS
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">Unlock 10% Off Your Initial Order Today</h2>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-sm mx-auto">
              Create an account or use code <strong className="underline text-white font-black">WELCOME100</strong> during checkout to settle terms.
            </p>
            <div className="pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-black text-white hover:bg-zinc-950 active:scale-98 transition-all duration-150 text-xs font-black uppercase tracking-widest shadow-lg"
              >
                <span>Get VIP Access</span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
