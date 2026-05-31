'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Star, ShieldAlert, Award, Truck, Check, Heart, ShoppingBag, ArrowRight, StarHalf, MessageSquare, HelpCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { dbService, DetailedProduct, Review } from '../../../services/db';
import { INITIAL_PRODUCTS } from '../../../constants/initialData';
import { useCartStore } from '../../../store/cartStore';
import { useWishlistStore } from '../../../store/wishlistStore';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage(props: PageProps) {
  const router = useRouter();
  
  // Unwrap parameters via Next.js 15 React.use standard
  const params = use(props.params);
  const slug = params.slug;

  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const hasInWishlist = useWishlistStore((state) => state.hasItem);

  // Component States
  const [product, setProduct] = useState<DetailedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  
  // Review management states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingInput, setRatingInput] = useState(5);
  const [titleInput, setTitleInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Frequently Bought Together states
  const [bundleChecked, setBundleChecked] = useState(true);
  
  // Zoom magnifier positions
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });

  // Load product catalog details
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const data = await dbService.getProductBySlug(slug);
      if (data) {
        setProduct(data);
        setActiveImage(data.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600');
        
        // Load default options selectors
        const defaults: Record<string, string> = {};
        data.options.forEach((opt: any) => {
          if (opt.values.length > 0) defaults[opt.name] = opt.values[0];
        });
        setSelectedOptions(defaults);

        // Fetch corresponding product reviews
        const revs = await dbService.getReviews(data.id);
        setReviews(revs);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [slug]);

  // Handle zoom magnifier movements
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    
    setZoomStyle({
      display: 'block',
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`,
      backgroundSize: '200%'
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (product && commentInput.trim() && nameInput.trim()) {
      const newRev = await dbService.addReview(
        product.id,
        ratingInput,
        titleInput || 'Verified Purchase Feedback',
        commentInput,
        nameInput
      );
      setReviews(prev => [newRev, ...prev]);
      setReviewSubmitted(true);
      setTitleInput('');
      setCommentInput('');
      setNameInput('');
    }
  };

  // Checkout redirect handles
  const handleBuyNow = () => {
    if (product) {
      addItem(product, 1);
      router.push('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase font-black tracking-widest text-muted-foreground">Loading Luxury Specifications...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-black uppercase">Product Not Found</h2>
        <p className="text-sm text-muted-foreground">The product requested could not be retrieved from our inventory databases.</p>
        <Link href="/" className="inline-block px-8 py-3.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-wider">
          Return Storefront
        </Link>
      </div>
    );
  }

  const isSaved = hasInWishlist(product.id);
  const currentPrice = product.sale_price || product.price;

  // Retrieve frequently bought together bundle math
  const relativeProduct = INITIAL_PRODUCTS.find(p => p.id !== product.id && p.category === product.category) || INITIAL_PRODUCTS[0];
  const relativePrice = relativeProduct.sale_price || relativeProduct.price;
  const bundleTotal = currentPrice + (bundleChecked ? relativePrice : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Dynamic breadcrumb */}
      <div className="text-xs text-muted-foreground uppercase font-black tracking-widest mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-accent">Storefront</Link>
        <span>/</span>
        <Link href={`/search?category=${product.category.toLowerCase()}`} className="hover:text-accent">{product.category}</Link>
        <span>/</span>
        <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* ====================================================
            A. GALLERY & THUMBNAILS (LEFT COLUMN - 6 SPACES)
            ==================================================== */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Main Visual Magnifier display */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full aspect-square bg-muted/20 border border-border/60 rounded-3xl overflow-hidden relative cursor-crosshair"
          >
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {/* Zoom viewport layer */}
            <div
              style={zoomStyle}
              className="absolute inset-0 pointer-events-none border border-border rounded-3xl bg-no-repeat bg-center bg-background"
            />
          </div>

          {/* Gallery Thumbnails row */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`w-20 h-20 bg-muted/20 border rounded-xl overflow-hidden cursor-pointer transition-all ${
                    activeImage === imgUrl ? 'border-accent ring-1 ring-accent' : 'border-border/60 hover:border-accent/40'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail view ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

        </div>

        {/* ====================================================
            B. VARIANT SELECTORS & DETAILS (RIGHT COLUMN - 6 SPACES)
            ==================================================== */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Trust certifications and titles */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-accent/15 border border-accent/30 text-accent font-black uppercase text-[9.5px] px-2.5 py-0.5 rounded tracking-widest">
                {product.brand} ORIGINAL
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-accent" />
                <span>Verified Stock Integrity</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground leading-tight">{product.name}</h1>
            <p className="text-xs text-muted-foreground uppercase font-black tracking-wider">SKU: {product.sku}</p>
          </div>

          {/* Rating stars averages */}
          <div className="flex items-center gap-2 border-b border-border/50 pb-4">
            <div className="flex text-accent gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent" />
              ))}
            </div>
            <span className="text-sm font-black text-foreground">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews.length} Verified Customer Reviews)</span>
          </div>

          {/* Core pricing and sales details */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-foreground">₦{currentPrice.toLocaleString()}</span>
              {product.sale_price && (
                <span className="text-base text-muted-foreground line-through">₦{product.price.toLocaleString()}</span>
              )}
            </div>
            {product.sale_price && (
              <p className="text-xs text-destructive font-black uppercase tracking-wider">
                Instant Savings of ₦{(product.price - product.sale_price).toLocaleString()} (-{Math.round(product.discount || 0)}% Off)
              </p>
            )}
          </div>

          {/* Option Attributes Selectors */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-5 border-t border-b border-border/50 py-5">
              {product.options.map((opt) => (
                <div key={opt.name} className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">{opt.name}</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {opt.values.map((val) => {
                      const isActive = selectedOptions[opt.name] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleOptionChange(opt.name, val)}
                          className={`px-4 py-2 text-xs font-bold rounded-full border transition-all duration-150 ${
                            isActive
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background hover:bg-muted text-muted-foreground border-border/60 hover:text-foreground'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Delivery & stock indicators */}
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-accent" />
              <div>
                <p className="text-foreground">VIP Courier Delivery</p>
                <span>₦2,000 ground (Standard Free Lagos)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              <div>
                <p className="text-foreground">In Stock Capacity</p>
                <span>{product.inventory} units verified ready</span>
              </div>
            </div>
          </div>

          {/* Core Shopping buttons */}
          <div className="space-y-3 pt-4">
            
            <div className="flex gap-4">
              <button
                onClick={() => addItem(product, 1)}
                className="flex-1 py-4 rounded-full border border-primary/20 bg-secondary hover:bg-muted text-foreground text-xs font-black uppercase tracking-widest transition-all duration-150 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-accent" />
                <span>Add to Shopping Bag</span>
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-full border transition-colors duration-150 ${
                  isSaved
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-secondary border-border/60 text-muted-foreground hover:text-foreground'
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-accent' : ''}`} />
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-4 rounded-full gold-gradient hover:brightness-105 active:scale-98 text-white text-xs font-black uppercase tracking-widest transition-all duration-150 shadow-lg flex items-center justify-center gap-2"
            >
              <span>Instant Buy Now</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

          </div>

        </div>

      </div>

      {/* ====================================================
          C. FREQUENTLY BOUGHT TOGETHER BUNDLES
          ==================================================== */}
      <section className="py-12 border-t border-border/50 mt-16">
        <div className="mb-6">
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-accent fill-accent" />
            <span>Frequently Bought Together</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Elevate your experience with recommended complementary articles.</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-8 justify-between glass-panel">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Primary item card */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted/20 border border-border flex-shrink-0">
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-foreground truncate max-w-[150px]">{product.name}</p>
                <span className="font-black text-muted-foreground">₦{currentPrice.toLocaleString()}</span>
              </div>
            </div>

            <span className="text-lg font-black text-muted-foreground">+</span>

            {/* Accessory item card */}
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={bundleChecked}
                  onChange={(e) => setBundleChecked(e.target.checked)}
                  className="accent-accent w-4 h-4"
                />
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted/20 border border-border flex-shrink-0">
                  <img src={relativeProduct.image_url} alt={relativeProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-foreground truncate max-w-[150px]">{relativeProduct.name}</p>
                  <span className="font-black text-muted-foreground">₦{relativePrice.toLocaleString()}</span>
                </div>
              </label>
            </div>
          </div>

          {/* Bundle checkouts */}
          <div className="flex items-center gap-6 flex-wrap justify-end">
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-semibold">Combined Bundle Total</p>
              <h3 className="text-xl font-black text-gold-gradient">₦{bundleTotal.toLocaleString()}</h3>
            </div>
            <button
              onClick={() => {
                addItem(product, 1);
                if (bundleChecked) addItem(relativeProduct, 1);
                router.push('/cart');
              }}
              className="px-8 py-3.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-widest shadow-md hover:brightness-95"
            >
              Add Bundle to Bag
            </button>
          </div>

        </div>
      </section>

      {/* ====================================================
          D. SPECIFICATIONS GRID
          ==================================================== */}
      <section className="py-12 border-t border-border/50">
        <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-6">Technical Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(product.specifications).map(([key, val]) => (
            <div key={key} className="flex justify-between p-3.5 border-b border-border/50 text-sm">
              <span className="font-bold text-muted-foreground">{key}</span>
              <span className="font-extrabold text-foreground">{val}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          E. FAQs ACCORDION
          ==================================================== */}
      <section className="py-12 border-t border-border/50">
        <div className="mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-accent" />
          <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight">Product Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4 max-w-3xl">
          {product.faqs.map((faq, i) => (
            <div key={i} className="p-5 border border-border/60 rounded-2xl bg-card space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-foreground">Q: {faq.q}</h4>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">A: {faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====================================================
          F. REVIEWS SUMMARY & INSERTION FORM
          ==================================================== */}
      <section className="py-12 border-t border-border/50">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Review averages dashboard */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight flex items-center gap-1.5">
              <MessageSquare className="w-5 h-5 text-accent" />
              <span>Customer Ratings</span>
            </h2>

            <div className="bg-card border border-border p-6 rounded-3xl text-center space-y-4 glass-panel">
              <h3 className="text-4xl font-black text-foreground">{product.rating.toFixed(1)}</h3>
              <div className="flex text-accent gap-0.5 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4.5 h-4.5 fill-accent" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Based on {reviews.length} authenticated reviews</p>
              
              {/* Ratings progress rows */}
              <div className="space-y-2.5 pt-2 text-left">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>5 Star</span>
                  <div className="flex-1 mx-3 bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-accent h-full w-[90%]" />
                  </div>
                  <span>90%</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>4 Star</span>
                  <div className="flex-1 mx-3 bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-accent h-full w-[8%]" />
                  </div>
                  <span>8%</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span>3 Star</span>
                  <div className="flex-1 mx-3 bg-muted h-2 rounded-full overflow-hidden">
                    <div className="bg-accent h-full w-[2%]" />
                  </div>
                  <span>2%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Reviews list and submit reviews */}
          <div className="lg:col-span-8 space-y-8">
            <h3 className="font-black text-sm uppercase tracking-wider">Customer Feedback</h3>
            
            {/* List */}
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-5 border border-border/50 rounded-2xl bg-card space-y-3 shadow-sm text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{rev.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        By {rev.user_name} on {new Date(rev.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex text-accent gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-accent" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>

            {/* Submission form */}
            <div className="p-6 border border-border rounded-3xl bg-card glass-panel text-left">
              <h4 className="font-black text-sm uppercase tracking-wider text-foreground mb-4">Write a Verified Review</h4>
              
              {reviewSubmitted ? (
                <div className="bg-accent/15 border border-accent/30 text-accent font-bold p-4 rounded-2xl text-xs">
                  Thank you! Your feedback has been verified and inserted successfully.
                </div>
              ) : (
                <form onSubmit={handleAddReview} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-muted-foreground">Rating</label>
                      <select
                        value={ratingInput}
                        onChange={(e) => setRatingInput(Number(e.target.value))}
                        className="w-full border border-border bg-background rounded-xl p-2.5 text-xs font-bold"
                      >
                        <option value={5}>5 Stars - Perfect</option>
                        <option value={4}>4 Stars - Very Solid</option>
                        <option value={3}>3 Stars - Good</option>
                        <option value={2}>2 Stars - OK</option>
                        <option value={1}>1 Star - Poor</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-muted-foreground">Your Name</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        required
                        className="w-full border border-border bg-background rounded-xl p-2.5 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">Review Title</label>
                    <input
                      type="text"
                      placeholder="Summarize your review"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                      className="w-full border border-border bg-background rounded-xl p-2.5 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">Comments</label>
                    <textarea
                      rows={3}
                      placeholder="What was your experience with variant styling, packing, or speed?"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      required
                      className="w-full border border-border bg-background rounded-xl p-2.5 text-xs focus:ring-accent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </section>

    </div>
  );
}
