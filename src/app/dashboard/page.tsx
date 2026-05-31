'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, ShoppingBag, MapPin, Bell, LogOut, ArrowRight, ShieldCheck, CheckCircle2, Truck, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService, Order } from '../../services/db';
import { useAuthStore } from '../../store/authStore';

type TabType = 'profile' | 'orders' | 'addresses' | 'notifications';

const NOTIFICATIONS = [
  { id: 'not-1', title: 'Welcome to Zoko VIP Club', message: 'You now have priority access to verified brand drops and priority logistics routes.', date: 'Today' },
  { id: 'not-2', title: 'Promo Code Activated: WELCOME100', message: 'Use this code during checkout for 10% off your initial luxury purchase.', date: '1 Day Ago' }
];

export default function UserDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Address edit state simulation
  const [addressName, setAddressName] = useState(user?.fullName || 'Obinna Nwosu');
  const [addressStreet, setAddressStreet] = useState('14 Ikoyi Crescent');
  const [addressCity, setAddressCity] = useState('Ikoyi, Lagos');
  const [addressPhone, setAddressPhone] = useState('+234 803 000 0000');
  const [addressSaved, setAddressSaved] = useState(false);

  // Session route shield
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoadingOrders(true);
      const data = await dbService.getUserOrders();
      setOrders(data);
      setLoadingOrders(false);
    };

    fetchOrders();
  }, [activeTab]);

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setAddressSaved(true);
    setTimeout(() => setAddressSaved(false), 3000);
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4 animate-pulse">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase font-black tracking-widest text-muted-foreground">Loading Secure VIP Session...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title */}
      <div className="mb-10 text-left border-b border-border/50 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">VIP Account Portal</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
            Monitor your logistics tracking, adjust addresses, and review active promotions.
          </p>
        </div>
        <Link 
          href="/admin" 
          className="px-6 py-2.5 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 hover:bg-[#d4af37]/15 text-[#d4af37] text-xs font-black uppercase tracking-wider text-center"
        >
          Access Enterprise Admin
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* ====================================================
            A. DASHBOARD SIDEBAR NAVIGATION (3 SPACES)
            ==================================================== */}
        <nav className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 border-b border-border lg:border-0 lg:space-y-1.5 flex-shrink-0 scrollbar-hide">
          
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2.5 px-4.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors w-full flex-shrink-0 text-left ${
              activeTab === 'profile'
                ? 'bg-primary text-primary-foreground font-black'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="w-4.5 h-4.5" />
            <span>Profile Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2.5 px-4.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors w-full flex-shrink-0 text-left ${
              activeTab === 'orders'
                ? 'bg-primary text-primary-foreground font-black'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            <span>Order History ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`flex items-center gap-2.5 px-4.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors w-full flex-shrink-0 text-left ${
              activeTab === 'addresses'
                ? 'bg-primary text-primary-foreground font-black'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <MapPin className="w-4.5 h-4.5" />
            <span>Address Coordinates</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-2.5 px-4.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors w-full flex-shrink-0 text-left ${
              activeTab === 'notifications'
                ? 'bg-primary text-primary-foreground font-black'
                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            <Bell className="w-4.5 h-4.5" />
            <span>Notifications</span>
          </button>

          <button
            onClick={async () => {
              await signOut();
              router.push('/login');
            }}
            className="flex items-center gap-2.5 px-4.5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors w-full flex-shrink-0 text-left text-destructive hover:bg-destructive/10 mt-6 lg:mt-auto"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>

        </nav>

        {/* ====================================================
            B. MAIN VIEWPORT DETAIL PANELS (9 SPACES)
            ==================================================== */}
        <div className="lg:col-span-9 w-full">
          <AnimatePresence mode="wait">
            
            {/* VIEW A: Profile Dashboard */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6 text-left"
              >
                <div className="bg-card border border-border p-6 rounded-3xl shadow-sm glass-panel flex gap-4 items-center flex-wrap">
                  <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent overflow-hidden relative">
                    {user?.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.fullName || 'User'} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-8 h-8" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-foreground">{user?.fullName || 'VIP Client'}</h2>
                      <span className="bg-accent/15 border border-accent/30 text-accent font-black uppercase text-[8px] px-2 py-0.5 rounded tracking-widest">
                        VIP GOLD CUSTOMER
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[9px] text-muted-foreground uppercase font-black tracking-wider">Joined May 2026</span>
                      {user?.dbConfirmed && (
                        <span className="inline-flex items-center gap-0.5 bg-[#10b981]/15 border border-[#10b981]/30 text-[#10b981] font-bold uppercase text-[7px] px-1.5 py-0.5 rounded tracking-widest">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          <span>Real Database Synced</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card border border-border/60 p-6 rounded-2xl space-y-2">
                    <ShieldCheck className="w-6 h-6 text-accent" />
                    <h3 className="text-sm font-bold text-foreground">Active Authentication</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Secured dynamically using Supabase JSON Web Token (JWT) credentials mapping unique identifier constraints.
                    </p>
                  </div>
                  <div className="bg-card border border-border/60 p-6 rounded-2xl space-y-2">
                    <Truck className="w-6 h-6 text-accent" />
                    <h3 className="text-sm font-bold text-foreground">Logistics Coverage</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Lagos Island, Lekki Peninsula, Ikeja Mainland, and Abuja VIP delivery coordinates active under priority ground shipping.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW B: Order History List */}
            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4 text-left"
              >
                {loadingOrders ? (
                  <div className="text-center text-xs uppercase font-black tracking-widest text-muted-foreground py-10">
                    Loading tracking registers...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-card border border-border p-12 rounded-3xl text-center space-y-4 glass-panel max-w-sm mx-auto">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground/50 mx-auto" />
                    <div>
                      <h3 className="font-bold text-sm">No orders recorded yet</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Your completed invoices will be visible here for fast logistics tracking.
                      </p>
                    </div>
                    <Link
                      href="/"
                      className="inline-block px-6 py-2.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-wider"
                    >
                      Shop Catalog
                    </Link>
                  </div>
                ) : (
                  orders.map((o) => (
                    <div
                      key={o.id}
                      className="bg-card border border-border/60 p-6 rounded-2xl shadow-sm space-y-4 hover:border-accent/30 transition-colors"
                    >
                      {/* Invoice top summary */}
                      <div className="flex justify-between items-center gap-4 flex-wrap pb-3 border-b border-border/40">
                        <div>
                          <span className="text-gold-gradient font-black text-sm tracking-wide">{o.id}</span>
                          <p className="text-[10px] text-muted-foreground">Order Date: {new Date(o.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block bg-accent/15 border border-accent/30 text-accent font-black uppercase text-[9px] px-2 py-0.5 rounded tracking-widest mb-1.5">
                            {o.status}
                          </span>
                          <p className="text-xs font-black text-foreground">₦{o.total.toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Items loop */}
                      <div className="space-y-2.5">
                        {o.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs gap-3 font-semibold">
                            <span className="text-foreground truncate max-w-[200px]">{it.product_name}</span>
                            <span className="text-muted-foreground">Qty {it.quantity} @ ₦{it.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Dynamic Logistics Progress Bar */}
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                          <span className="text-accent font-extrabold">Pending</span>
                          <span className={o.status === 'processing' || o.status === 'shipped' || o.status === 'delivered' ? 'text-accent font-extrabold' : ''}>Processing</span>
                          <span className={o.status === 'shipped' || o.status === 'delivered' ? 'text-accent font-extrabold' : ''}>Shipped</span>
                          <span className={o.status === 'delivered' ? 'text-accent font-extrabold' : ''}>Delivered</span>
                        </div>
                        <div className="bg-muted h-2 rounded-full overflow-hidden flex">
                          <div className={`h-full bg-accent ${
                            o.status === 'pending' ? 'w-1/4' : o.status === 'processing' ? 'w-2/4' : o.status === 'shipped' ? 'w-3/4' : 'w-full'
                          }`} />
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </motion.div>
            )}

            {/* VIEW C: Address Book */}
            {activeTab === 'addresses' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4 text-left"
              >
                <form onSubmit={handleSaveAddress} className="bg-card border border-border p-6 rounded-3xl shadow-sm glass-panel space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Default Logistics Coordinates</h3>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-muted-foreground">Contact Full Name</label>
                      <input
                        type="text"
                        value={addressName}
                        onChange={(e) => setAddressName(e.target.value)}
                        required
                        className="w-full border border-border bg-background rounded-xl p-2.5 text-xs font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-muted-foreground">Street Coordinates</label>
                      <input
                        type="text"
                        value={addressStreet}
                        onChange={(e) => setAddressStreet(e.target.value)}
                        required
                        className="w-full border border-border bg-background rounded-xl p-2.5 text-xs font-semibold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-muted-foreground">City & State</label>
                        <input
                          type="text"
                          value={addressCity}
                          onChange={(e) => setAddressCity(e.target.value)}
                          required
                          className="w-full border border-border bg-background rounded-xl p-2.5 text-xs font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-muted-foreground">Phone Number</label>
                        <input
                          type="tel"
                          value={addressPhone}
                          onChange={(e) => setAddressPhone(e.target.value)}
                          required
                          className="w-full border border-border bg-background rounded-xl p-2.5 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-wider hover:brightness-105 transition-all shadow-md"
                  >
                    Save Changes
                  </button>

                  {addressSaved && (
                    <p className="text-[10px] text-accent font-bold uppercase tracking-wider animate-pulse pt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Changes Saved Successfully!</span>
                    </p>
                  )}
                </form>
              </motion.div>
            )}

            {/* VIEW D: Notifications */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4 text-left"
              >
                {NOTIFICATIONS.map((not) => (
                  <div
                    key={not.id}
                    className="p-5 border border-border/50 rounded-2xl bg-card space-y-1 shadow-sm flex items-start justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black uppercase tracking-wider text-foreground">{not.title}</h4>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{not.message}</p>
                    </div>
                    <span className="text-[9px] uppercase font-black tracking-widest text-muted-foreground flex-shrink-0">{not.date}</span>
                  </div>
                ))}
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
