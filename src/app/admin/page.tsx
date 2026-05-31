'use client';

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, BarChart, Bar } from 'recharts';
import { DollarSign, ShoppingBag, Package, Users, SlidersHorizontal, ArrowUpRight, AlertTriangle, Play, Pause, RefreshCw, X, Plus, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { dbService } from '../../services/db';
import { INITIAL_PRODUCTS, DetailedProduct } from '../../constants/initialData';

// Chart aesthetic colors (metallic golds, deep slate darks)
const COLORS = ['#d4af37', '#aa7c11', '#52525b', '#18181b'];

export default function AdminDashboard() {
  // Database metrics states
  const [kpis, setKpis] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [productSales, setProductSales] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [productsList, setProductsList] = useState<DetailedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Active module tab
  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'inventory' | 'orders'>('overview');

  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  // Restock modal state simulation
  const [selectedProduct, setSelectedProduct] = useState<DetailedProduct | null>(null);
  const [restockQty, setRestockQty] = useState(10);
  const [restockSuccess, setRestockSuccess] = useState(false);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      const data = await dbService.getAdminMetrics();
      setKpis(data.kpis);
      setRevenueData(data.revenueData);
      setProductSales(data.productSales);
      setUserGrowth(data.userGrowth);

      // Load products for inventory tracking
      const prods = await dbService.getProducts();
      setProductsList(prods);

      // Load orders for management
      const ords = await dbService.getUserOrders();
      setOrdersList(ords);
      setLoading(false);
    };

    fetchAdminData();
  }, []);

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct) {
      // Simulate database stock updates
      setProductsList(prev => 
        prev.map(p => p.id === selectedProduct.id ? { ...p, inventory: p.inventory + restockQty } : p)
      );
      setRestockSuccess(true);
      setTimeout(() => {
        setRestockSuccess(false);
        setSelectedProduct(null);
        setRestockQty(10);
      }, 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Title */}
      <div className="mb-10 text-left border-b border-border/50 pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="inline-block bg-accent/20 border border-accent/40 rounded px-3 py-1 text-[9px] font-black uppercase tracking-widest text-accent mb-2">
            ENTERPRISE ARCHITECTURE MODE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">Operations Dashboard</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
            Evaluate live monthly revenue yields, user acquisition rates, and coordinate stock levels.
          </p>
        </div>

        {/* Tab actions */}
        <div className="flex gap-2 bg-muted/40 p-1.5 rounded-full border border-border">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-4.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              adminTab === 'overview' ? 'bg-primary text-primary-foreground font-black' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setAdminTab('products')}
            className={`px-4.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              adminTab === 'products' ? 'bg-primary text-primary-foreground font-black' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Product List
          </button>
          <button
            onClick={() => setAdminTab('inventory')}
            className={`px-4.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              adminTab === 'inventory' ? 'bg-primary text-primary-foreground font-black' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Inventory Logs
          </button>
          <button
            onClick={() => setAdminTab('orders')}
            className={`px-4.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              adminTab === 'orders' ? 'bg-primary text-primary-foreground font-black' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Order Management
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-black tracking-widest text-muted-foreground">Compiling Analytics Data...</p>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* ====================================================
              1. ACTIVE CORE MODULE TABS
              ==================================================== */}
          <AnimatePresence mode="wait">
            {adminTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                {/* A. KPI Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {kpis.map((kpi, idx) => {
                    const IconComponent = kpi.title.includes('Revenue')
                      ? DollarSign
                      : kpi.title.includes('Orders')
                      ? ShoppingBag
                      : kpi.title.includes('Products')
                      ? Package
                      : Users;

                    return (
                      <div
                        key={idx}
                        className="bg-card border border-border/60 p-6 rounded-2xl flex items-center justify-between shadow-sm relative group overflow-hidden"
                      >
                        <div className="text-left space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{kpi.title}</p>
                          <h3 className="text-2xl font-black text-foreground">{kpi.value}</h3>
                          <span className="text-[10px] font-semibold text-accent flex items-center gap-1">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>{kpi.change}</span>
                          </span>
                        </div>
                        <div className="p-3 bg-muted/60 border border-border/40 rounded-xl text-accent">
                          <IconComponent className="w-6 h-6" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* B. RECHARTS GRAPHIC LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Revenue timeline Area Chart */}
                  <div className="lg:col-span-2 bg-card border border-border p-6 rounded-3xl shadow-sm glass-panel space-y-4 text-left">
                    <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Revenue Timelines (₦)</h3>
                    <div className="w-full h-80 text-xs">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#d4af37" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                          <XAxis dataKey="name" stroke="#71717a" />
                          <YAxis stroke="#71717a" />
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} />
                          <Area type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Category pie chart */}
                  <div className="bg-card border border-border p-6 rounded-3xl shadow-sm glass-panel space-y-4 text-left">
                    <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Category Performance</h3>
                    <div className="w-full h-80 flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productSales}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {productSales.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      {/* Inner legend recap */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                        <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Top Segment</span>
                        <h4 className="text-sm font-black text-foreground">Smartphones</h4>
                      </div>
                    </div>
                  </div>

                </div>

                {/* C. USER ACQUISITIONS */}
                <div className="bg-card border border-border p-6 rounded-3xl shadow-sm glass-panel space-y-4 text-left">
                  <h3 className="text-xs font-black uppercase tracking-widest text-foreground">Customer Acquisition Timeline</h3>
                  <div className="w-full h-64 text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userGrowth} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.3} />
                        <XAxis dataKey="name" stroke="#71717a" />
                        <YAxis stroke="#71717a" />
                        <Tooltip contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '12px' }} />
                        <Line type="monotone" dataKey="customers" stroke="#d4af37" strokeWidth={3} activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW B: Products Management Table */}
            {adminTab === 'products' && (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm glass-panel text-left"
              >
                <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Product Catalog Manager ({productsList.length})</h3>
                  
                  <button className="px-5 py-2 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-wider shadow flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Product</span>
                  </button>
                </div>

                {/* Responsive Products grid list */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/40 uppercase tracking-wider font-black text-muted-foreground border-b border-border">
                        <th className="p-4 pl-6">Product details</th>
                        <th className="p-4">SKU</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Warehouse Stock</th>
                        <th className="p-4 pr-6">Logistics Actions</th>
                      </tr>
                    </thead>
                    <tbody className="font-semibold divide-y divide-border/40">
                      {productsList.slice(0, 10).map((p) => (
                        <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-4 pl-6 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted/20 border border-border/40 flex-shrink-0">
                              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-bold text-foreground line-clamp-1 max-w-[150px]">{p.name}</span>
                          </td>
                          <td className="p-4 font-mono text-muted-foreground">{p.sku}</td>
                          <td className="p-4 capitalize">{p.category}</td>
                          <td className="p-4 text-foreground font-black">₦{p.price.toLocaleString()}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-1.5">
                              <span>{p.inventory} units</span>
                              {p.inventory < 20 ? (
                                <span className="bg-destructive/10 border border-destructive/20 text-destructive text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest">
                                  LOW STOCK
                                </span>
                              ) : (
                                <span className="bg-accent/10 border border-accent/20 text-accent text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-widest">
                                  OK
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-4 pr-6">
                            <button
                              onClick={() => setSelectedProduct(p)}
                              className="text-accent hover:underline uppercase text-[10px] font-black"
                            >
                              Restock
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {/* VIEW C: Inventory logs and low-stock alerts */}
            {adminTab === 'inventory' && (
              <motion.div
                key="inventory"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4 text-left"
              >
                <div className="bg-card border border-border p-6 rounded-3xl shadow-sm glass-panel space-y-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                    <AlertTriangle className="w-5 h-5 text-accent" />
                    <span>Stock Warning Registers</span>
                  </h3>
                  
                  <div className="space-y-3">
                    {productsList.filter(p => p.inventory < 20).slice(0, 5).map(p => (
                      <div
                        key={p.id}
                        className="p-4 border border-destructive/20 bg-destructive/5 rounded-2xl flex items-center justify-between gap-4 flex-wrap"
                      >
                        <div className="text-xs">
                          <p className="font-bold text-foreground">Alert: Low Inventory count of {p.name}</p>
                          <span className="text-muted-foreground">SKU: {p.sku} | Category: {p.category}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-destructive font-black text-sm">{p.inventory} units left</span>
                          <button
                            onClick={() => setSelectedProduct(p)}
                            className="px-4 py-2 rounded-full border border-destructive/20 bg-destructive/10 text-destructive text-[10px] font-black uppercase hover:bg-destructive hover:text-white transition-colors"
                          >
                            Replenish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* VIEW D: Order Management Dashboard */}
            {adminTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm glass-panel text-left"
              >
                <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Order Operations Manager ({ordersList.length})</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/40 uppercase tracking-wider font-black text-muted-foreground border-b border-border">
                        <th className="p-4 pl-6">Order ID</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Total Amount</th>
                        <th className="p-4">Logistics Method</th>
                        <th className="p-4">Current Status</th>
                        <th className="p-4 pr-6">Change Status</th>
                      </tr>
                    </thead>
                    <tbody className="font-semibold divide-y divide-border/40">
                      {ordersList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            No orders placed on the system yet. Settle some checking out first!
                          </td>
                        </tr>
                      ) : (
                        ordersList.map((o) => (
                          <tr key={o.id} className="hover:bg-muted/10 transition-colors">
                            <td className="p-4 pl-6 font-mono text-accent font-black">{o.id}</td>
                            <td className="p-4">
                              <p className="font-bold text-foreground">{o.address?.name || 'VIP Client'}</p>
                              <span className="text-[10px] text-muted-foreground">{o.address?.phone || '0800-ZOKO-MALL'}</span>
                            </td>
                            <td className="p-4 text-foreground font-black">₦{o.total.toLocaleString()}</td>
                            <td className="p-4 capitalize">{o.payment_method || 'Paystack Gateway'}</td>
                            <td className="p-4">
                              <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest ${
                                o.status === 'delivered'
                                  ? 'bg-accent/15 border border-accent/30 text-accent'
                                  : o.status === 'processing'
                                  ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                                  : o.status === 'shipped'
                                  ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400'
                                  : o.status === 'cancelled'
                                  ? 'bg-destructive/10 border border-destructive/20 text-destructive'
                                  : 'bg-zinc-500/10 border border-zinc-500/30 text-zinc-400'
                              }`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4 pr-6">
                              <div className="flex gap-1.5 flex-wrap">
                                {['processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                                  <button
                                    key={st}
                                    disabled={updatingOrderId === o.id}
                                    onClick={async () => {
                                      setUpdatingOrderId(o.id);
                                      const res = await dbService.updateOrderStatus(o.id, st as any);
                                      if (res.success) {
                                        setOrdersList(prev =>
                                          prev.map(item => item.id === o.id ? { ...item, status: st } : item)
                                        );
                                      }
                                      setUpdatingOrderId(null);
                                    }}
                                    className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider border transition-colors ${
                                      o.status === st
                                        ? 'bg-primary border-primary text-primary-foreground'
                                        : 'bg-background hover:bg-muted border-border/60 text-muted-foreground hover:text-foreground'
                                    }`}
                                  >
                                    {st === 'processing' ? 'Paid' : st}
                                  </button>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

      {/* ====================================================
          2. POPUP MODAL: RESTOCK INVENTORY ACTION
          ==================================================== */}
      <AnimatePresence>
        {selectedProduct && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border p-6 rounded-3xl z-50 shadow-2xl glass-panel text-left space-y-6"
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h4 className="font-black text-sm uppercase tracking-wider text-foreground">Restock Warehouse</h4>
                <button onClick={() => setSelectedProduct(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {restockSuccess ? (
                <div className="bg-accent/15 border border-accent/30 text-accent font-black p-4 rounded-xl text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  <span>Warehouse Replenished!</span>
                </div>
              ) : (
                <form onSubmit={handleRestockSubmit} className="space-y-4">
                  <div className="text-xs">
                    <p className="font-bold text-foreground">{selectedProduct.name}</p>
                    <span className="text-muted-foreground">Current Stock: {selectedProduct.inventory} units</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">Restock Quantity</label>
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={restockQty}
                      onChange={(e) => setRestockQty(Number(e.target.value))}
                      required
                      className="w-full border border-border bg-background rounded-xl p-2.5 text-xs font-bold"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-widest shadow"
                  >
                    Confirm Warehouse Inbound
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
