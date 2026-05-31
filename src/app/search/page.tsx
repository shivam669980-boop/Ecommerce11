'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Heart, SlidersHorizontal, ArrowUpDown, X, Star, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService, DetailedProduct } from '../../services/db';
import { INITIAL_CATEGORIES, INITIAL_BRANDS } from '../../constants/initialData';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';

function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const hasInWishlist = useWishlistStore((state) => state.hasItem);

  // Read URL query parameters
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const brandParam = searchParams.get('brand') || '';
  const wishlistOnlyParam = searchParams.get('wishlist') === 'true';

  // Component Filter States
  const [products, setProducts] = useState<DetailedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchVal, setSearchVal] = useState(queryParam);
  
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedBrand, setSelectedBrand] = useState(brandParam);
  const [priceMax, setPriceMax] = useState<number>(5000000);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Sync search input with URL search state shifts
  useEffect(() => {
    setSearchVal(queryParam);
    setSelectedCategory(categoryParam);
    setSelectedBrand(brandParam);
  }, [queryParam, categoryParam, brandParam]);

  // Load and filter product items dynamically
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true);
      
      // If VIP wishlist tab is active
      if (wishlistOnlyParam) {
        setProducts(wishlistItems as DetailedProduct[]);
        setLoading(false);
        return;
      }

      const results = await dbService.getProducts({
        category: selectedCategory || undefined,
        brand: selectedBrand || undefined,
        search: queryParam || undefined,
        priceRange: [0, priceMax],
        rating: minRating || undefined,
        sort: selectedSort
      });
      
      setProducts(results);
      setLoading(false);
    };

    fetchFilteredProducts();
  }, [selectedCategory, selectedBrand, queryParam, priceMax, minRating, selectedSort, wishlistOnlyParam, wishlistItems]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchVal.trim()) {
      params.set('q', searchVal.trim());
    } else {
      params.delete('q');
    }
    params.delete('wishlist'); // search cancels wishlist only tab
    router.push(`/search?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceMax(5000000);
    setMinRating(0);
    setSelectedSort('popularity');
    router.push('/search');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Search Header title */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight uppercase">
          {wishlistOnlyParam ? 'Your Saved VIP Wishlist' : 'Luxury Explorer Engine'}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
          {wishlistOnlyParam 
            ? `Reviewing your saved collection of ${products.length} luxury products.`
            : `Discover premium authenticated articles. Found ${products.length} products.`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ====================================================
            A. FILTER SIDEBAR (DESKTOP)
            ==================================================== */}
        <aside className="hidden lg:block w-64 p-6 rounded-2xl border border-border bg-card shadow-sm sticky top-28 flex-shrink-0 glass-panel">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-border/60">
            <h3 className="font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-accent" />
              <span>Filters</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-[10px] uppercase font-bold text-accent hover:underline"
            >
              Reset All
            </button>
          </div>

          <div className="space-y-6">
            
            {/* Category Select */}
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider">Category</h4>
              <div className="space-y-1.5 text-sm max-h-48 overflow-y-auto no-scrollbar">
                {INITIAL_CATEGORIES.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.slug}
                      onChange={() => setSelectedCategory(cat.slug)}
                      className="accent-accent"
                    />
                    <span className="text-xs capitalize font-medium">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand Selection */}
            <div className="space-y-2 border-t border-border/50 pt-4">
              <h4 className="text-xs font-black uppercase tracking-wider">Brands</h4>
              <div className="space-y-1.5 text-sm max-h-48 overflow-y-auto no-scrollbar">
                {INITIAL_BRANDS.map((br) => (
                  <label key={br.id} className="flex items-center gap-2 cursor-pointer select-none text-muted-foreground hover:text-foreground">
                    <input
                      type="radio"
                      name="brand"
                      checked={selectedBrand === br.slug}
                      onChange={() => setSelectedBrand(br.slug)}
                      className="accent-accent"
                    />
                    <span className="text-xs font-medium">{br.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Max Slider */}
            <div className="space-y-3 border-t border-border/50 pt-4">
              <div className="flex justify-between text-xs font-black uppercase">
                <span>Max Price</span>
                <span className="text-accent font-bold">₦{priceMax.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={5000000}
                step={20000}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-accent bg-muted h-1 rounded-full cursor-pointer"
              />
            </div>

            {/* Rating Stars Select */}
            <div className="space-y-2 border-t border-border/50 pt-4">
              <h4 className="text-xs font-black uppercase tracking-wider">Rating Minimum</h4>
              <div className="space-y-1.5 text-xs font-semibold text-muted-foreground">
                {[4.5, 4, 3].map((stars) => (
                  <label key={stars} className="flex items-center gap-2 cursor-pointer hover:text-foreground">
                    <input
                      type="radio"
                      name="rating"
                      checked={minRating === stars}
                      onChange={() => setMinRating(stars)}
                      className="accent-accent"
                    />
                    <div className="flex gap-0.5 items-center">
                      <span className="mr-1">{stars}+</span>
                      <Star className="w-3.5 h-3.5 fill-accent text-accent" />
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* ====================================================
            B. MAIN CATALOG RESULTS VIEW
            ==================================================== */}
        <div className="flex-1 w-full space-y-6">
          
          {/* Top catalog control bar */}
          <div className="w-full bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between glass-panel">
            {/* Active mobile search */}
            <form onSubmit={handleSearchSubmit} className="w-full sm:max-w-sm relative group">
              <input
                type="text"
                placeholder="Search collection..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="w-full pl-4 pr-10 py-2 rounded-full border border-border bg-background focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-xs transition-colors"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-muted-foreground">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowFiltersMobile(true)}
                className="lg:hidden p-2 px-4 rounded-full border border-border hover:bg-muted text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>

              {/* Sorting selection */}
              <div className="flex items-center gap-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  className="border border-border bg-background rounded-full px-3 py-2 text-xs font-bold outline-none cursor-pointer focus:border-accent"
                >
                  <option value="popularity">Popularity</option>
                  <option value="rating">Rating</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>

            </div>
          </div>

          {/* Catalog grid display */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 space-y-4 animate-pulse">
                  <div className="w-full aspect-square bg-muted rounded-xl" />
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-1/3" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                  <div className="h-9 bg-muted rounded-xl w-full" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-16 text-center space-y-4 glass-panel max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-muted/60 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground/60" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg">No products found</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Try adjusting your price range, clearing some search letters, or resetting category selectors.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-wider hover:brightness-105"
              >
                Clear Search Engine
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => {
                const discountVal = p.discount ? Math.round(p.discount) : 0;
                const isSaved = hasInWishlist(p.id);
                const currentPrice = p.sale_price || p.price;
                
                return (
                  <motion.div
                    key={p.id}
                    layout
                    whileHover={{ y: -6 }}
                    className="bg-card border border-border/60 hover:border-accent/40 rounded-2xl p-3.5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-300 relative group overflow-hidden"
                  >
                    {discountVal > 0 && (
                      <span className="absolute top-3.5 left-3.5 z-10 bg-destructive/10 border border-destructive/20 text-destructive text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        -{discountVal}% Off
                      </span>
                    )}

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

                    <Link href={`/product/${p.slug}`} className="block w-full aspect-square bg-muted/30 rounded-xl overflow-hidden mb-4 relative">
                      <img
                        src={p.image_url}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">{p.brand}</p>
                        <h3 className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 hover:text-accent transition-colors mb-1.5">
                          <Link href={`/product/${p.slug}`}>{p.name}</Link>
                        </h3>
                        
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-3.5 h-3.5 fill-accent text-accent" />
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
          )}

        </div>

      </div>

      {/* ====================================================
          C. MOBILE FILTER OVERLAY DRAWER
          ==================================================== */}
      <AnimatePresence>
        {showFiltersMobile && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersMobile(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-full bg-card border-r border-border z-50 p-6 flex flex-col justify-between shadow-2xl glass-panel lg:hidden"
            >
              <div className="space-y-6 overflow-y-auto no-scrollbar">
                
                <div className="flex items-center justify-between border-b border-border/60 pb-4">
                  <h3 className="font-black text-sm uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-accent" />
                    <span>Filters</span>
                  </h3>
                  <button
                    onClick={() => setShowFiltersMobile(false)}
                    className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Category select mobile */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider">Category</h4>
                  <div className="space-y-1.5 text-sm max-h-36 overflow-y-auto no-scrollbar">
                    {INITIAL_CATEGORIES.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                        <input
                          type="radio"
                          name="category-m"
                          checked={selectedCategory === cat.slug}
                          onChange={() => setSelectedCategory(cat.slug)}
                          className="accent-accent"
                        />
                        <span className="text-xs capitalize">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands mobile */}
                <div className="space-y-2 border-t border-border/50 pt-4">
                  <h4 className="text-xs font-black uppercase tracking-wider">Brands</h4>
                  <div className="space-y-1.5 text-sm max-h-36 overflow-y-auto no-scrollbar">
                    {INITIAL_BRANDS.map((br) => (
                      <label key={br.id} className="flex items-center gap-2 cursor-pointer text-muted-foreground hover:text-foreground">
                        <input
                          type="radio"
                          name="brand-m"
                          checked={selectedBrand === br.slug}
                          onChange={() => setSelectedBrand(br.slug)}
                          className="accent-accent"
                        />
                        <span className="text-xs">{br.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price mobile */}
                <div className="space-y-3 border-t border-border/50 pt-4">
                  <div className="flex justify-between text-xs font-black uppercase">
                    <span>Max Price</span>
                    <span className="text-accent font-bold">₦{priceMax.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={10000}
                    max={5000000}
                    step={20000}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-accent bg-muted h-1 rounded-full cursor-pointer"
                  />
                </div>

              </div>

              <div className="pt-6 border-t border-border space-y-2.5">
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="w-full py-3 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-widest shadow-md"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => {
                    handleResetFilters();
                    setShowFiltersMobile(false);
                  }}
                  className="w-full py-3 rounded-full border border-border bg-muted hover:bg-muted/80 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  Reset All
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center font-bold text-sm">
        Loading Search Engine Hub...
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
