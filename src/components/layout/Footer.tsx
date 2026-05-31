'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-[#0b0b0d] border-t border-zinc-800 text-zinc-400 py-16 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zinc-900/40 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 border-b border-zinc-800/80 pb-12">
          
          {/* Column 1: Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5">
                <span className="text-white">ZOKO</span>
                <span className="text-gold-gradient font-extrabold text-sm sm:text-base border border-accent/30 rounded px-1.5 py-0.5 bg-accent/5">
                  MALL
                </span>
              </span>
            </Link>
            <p className="text-sm max-w-sm text-zinc-500">
              Inspired by the elite efficiency of Amazon and crafted with premium boutique mechanics. Elevate your everyday style, tech accessories, and home aesthetics.
            </p>
            
            {/* Interactive Newsletter */}
            <div className="space-y-3 max-w-sm">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Join the Elite Circle</span>
              </h4>
              
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/10 border border-accent/20 rounded-xl p-3.5 text-xs text-accent font-semibold"
                >
                  Welcome aboard. Exclusive notifications are headed your way.
                </motion.div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex relative items-center group">
                  <input
                    type="email"
                    placeholder="Enter your VIP email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-4 pr-12 py-3 rounded-full border border-zinc-800 bg-zinc-900/50 focus:bg-zinc-900 text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 p-2 rounded-full gold-gradient hover:brightness-105 text-white active:scale-95 transition-all duration-150"
                  >
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Column 2: Categories */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Collections</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/search?category=smartphones" className="hover:text-accent transition-colors">Smartphones</Link></li>
              <li><Link href="/search?category=laptops" className="hover:text-accent transition-colors">Laptops</Link></li>
              <li><Link href="/search?category=electronics" className="hover:text-accent transition-colors">Electronics</Link></li>
              <li><Link href="/search?category=furniture" className="hover:text-accent transition-colors">Hardwood Furniture</Link></li>
              <li><Link href="/search?category=shoes" className="hover:text-accent transition-colors">Premium Shoes</Link></li>
            </ul>
          </div>

          {/* Column 3: Premium Partners */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">Our Partners</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/search?brand=apple" className="hover:text-accent transition-colors">Apple Inc.</Link></li>
              <li><Link href="/search?brand=samsung" className="hover:text-accent transition-colors">Samsung Tech</Link></li>
              <li><Link href="/search?brand=sony" className="hover:text-accent transition-colors">Sony Audio</Link></li>
              <li><Link href="/search?brand=dyson" className="hover:text-accent transition-colors">Dyson Flow</Link></li>
              <li><Link href="/search?brand=ikea" className="hover:text-accent transition-colors">IKEA Sweden</Link></li>
            </ul>
          </div>

          {/* Column 4: Help & Info */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-white">VIP Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/dashboard" className="hover:text-accent transition-colors">Track Orders</Link></li>
              <li><Link href="/search" className="hover:text-accent transition-colors">Refund Policies</Link></li>
              <li><Link href="/dashboard" className="hover:text-accent transition-colors">WhatsApp Concierge</Link></li>
              <li><Link href="/admin" className="hover:text-accent transition-colors">Enterprise Admin</Link></li>
              <li><Link href="/search" className="hover:text-accent transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Footer Base Legal and Payments */}
        <div className="mt-12 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-zinc-600">
          
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4.5 h-4.5 text-accent" />
            <span>© 2026 Zoko Luxury Mall. Real Supabase-secured transactions.</span>
          </div>

          {/* Security and Accepted Payments */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <span className="flex items-center gap-1 text-zinc-500">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Integrated checkout:</span>
            </span>
            <span className="font-extrabold text-[10px] uppercase border border-zinc-800 rounded px-1.5 py-0.5 bg-zinc-900/30 tracking-widest text-white">
              PAYSTACK
            </span>
            <span className="font-extrabold text-[10px] uppercase border border-zinc-800 rounded px-1.5 py-0.5 bg-zinc-900/30 tracking-widest text-white">
              STRIPE
            </span>
            <span className="font-extrabold text-[10px] uppercase border border-zinc-800 rounded px-1.5 py-0.5 bg-zinc-900/30 tracking-widest text-white">
              PAYPAL
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
