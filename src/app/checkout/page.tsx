'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, Truck, CreditCard, ChevronRight, CheckCircle2, Copy, Sparkles, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../../store/cartStore';
import { dbService } from '../../services/db';

type CheckoutStep = 'address' | 'shipping' | 'payment' | 'success';

export default function CheckoutPage() {
  const router = useRouter();
  
  // State handles
  const cartItems = useCartStore((state) => state.items);
  const cartSubtotal = useCartStore((state) => state.getCartSubtotal());
  const cartDiscount = useCartStore((state) => state.getCartDiscount());
  const cartTax = useCartStore((state) => state.getCartTax());
  const clearCart = useCartStore((state) => state.clearCart);

  const [step, setStep] = useState<CheckoutStep>('address');
  const [orderTrackingId, setOrderTrackingId] = useState('');
  const [copied, setCopied] = useState(false);

  // Form selections data states
  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [phone, setPhone] = useState('');

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'priority' | 'concierge'>('standard');
  const [paymentOption, setPaymentOption] = useState<'card' | 'transfer'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  const [payingWithPaystack, setPayingWithPaystack] = useState(false);
  const [paystackError, setPaystackError] = useState('');

  // Load Paystack inline popup script dynamically
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Settle pricing calculations based on selected logistics methods
  const getShippingCost = () => {
    if (shippingMethod === 'standard') return 2000;
    if (shippingMethod === 'priority') return 5000;
    return 12000;
  };

  const getShippingLabel = () => {
    if (shippingMethod === 'standard') return 'Standard Ground Logistics';
    if (shippingMethod === 'priority') return 'Priority Express Air';
    return 'VIP Same-Day Dedicated Concierge';
  };

  const finalTotal = Math.max(0, cartSubtotal - cartDiscount + cartTax + getShippingCost());

  const handleNextStep = () => {
    if (step === 'address') {
      if (fullName.trim() && street.trim() && city.trim() && stateName.trim() && phone.trim()) {
        setStep('shipping');
      }
    } else if (step === 'shipping') {
      setStep('payment');
    }
  };

  const handlePrevStep = () => {
    if (step === 'shipping') setStep('address');
    else if (step === 'payment') setStep('shipping');
  };

  const handleSettleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'payment') {
      if (paymentOption === 'card') {
        setPayingWithPaystack(true);
        setPaystackError('');
        
        try {
          const paystackKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_d30f78bf11e2f7b8801d09e51c8a14b5319c8942';
          
          const windowWithPaystack = window as any;
          if (!windowWithPaystack.PaystackPop) {
            throw new Error('Paystack Gateway is currently loading. Please wait a second and try again.');
          }

          const handler = windowWithPaystack.PaystackPop.setup({
            key: paystackKey,
            email: fullName.toLowerCase().replace(/\s+/g, '') + '@zokoluxury.com',
            amount: Math.round(finalTotal * 100), // in kobo
            currency: 'NGN',
            ref: `ZKO-${Math.floor(100000 + Math.random() * 900000)}`,
            metadata: {
              custom_fields: [
                {
                  display_name: "Customer Name",
                  variable_name: "customer_name",
                  value: fullName
                },
                {
                  display_name: "Phone Number",
                  variable_name: "phone_number",
                  value: phone
                }
              ]
            },
            callback: async (response: any) => {
              const res = await dbService.submitOrder({
                items: cartItems,
                address: {
                  name: fullName,
                  street,
                  city,
                  state: stateName,
                  phone
                },
                paymentMethod: 'Paystack Integrated Gateway',
                subtotal: cartSubtotal,
                shipping: getShippingCost(),
                tax: cartTax,
                total: finalTotal
              });

              if (res.success) {
                setOrderTrackingId(res.orderId);
                setStep('success');
                clearCart();
              } else {
                setPaystackError('Order placement failed: ' + res.message);
              }
              setPayingWithPaystack(false);
            },
            onClose: () => {
              setPayingWithPaystack(false);
              setPaystackError('Payment gate was closed by customer.');
            }
          });

          handler.openIframe();
        } catch (err: any) {
          setPayingWithPaystack(false);
          setPaystackError(err.message || 'Payment engine encountered a loading roadblock.');
        }
      } else {
        // Bank transfer Settle flow
        const res = await dbService.submitOrder({
          items: cartItems,
          address: {
            name: fullName,
            street,
            city,
            state: stateName,
            phone
          },
          paymentMethod: 'Bank Transfer (Simulated)',
          subtotal: cartSubtotal,
          shipping: getShippingCost(),
          tax: cartTax,
          total: finalTotal
        });

        if (res.success) {
          setOrderTrackingId(res.orderId);
          setStep('success');
          clearCart();
        }
      }
    }
  };

  const handleCopyTracking = () => {
    navigator.clipboard.writeText(orderTrackingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCartQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  if (cartItems.length === 0 && step !== 'success') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8 text-muted-foreground/60" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-black uppercase">Your Bag is empty</h2>
          <p className="text-sm text-muted-foreground">Checkout requires at least one luxury product in your shopping bag.</p>
        </div>
        <Link href="/" className="inline-block px-8 py-3.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-wider">
          Return Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {step !== 'success' && (
        <div className="mb-10 text-left">
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">VIP Checkout</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1.5">
            Complete your shipping coordinates and finalize simulated card settlements.
          </p>
        </div>
      )}

      {/* ====================================================
          1. SUCCESS SCREEN VIEW (FINAL PHASES)
          ==================================================== */}
      {step === 'success' ? (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-xl mx-auto bg-card border border-border p-8 sm:p-12 rounded-3xl text-center space-y-8 glass-panel shadow-2xl relative"
        >
          {/* Subtle floating gold stars animations */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute top-6 left-12 w-2 h-2 rounded-full gold-gradient animate-ping" />
            <div className="absolute bottom-12 right-20 w-3.5 h-3.5 rounded-full gold-gradient animate-bounce" />
          </div>

          <div className="space-y-4">
            <CheckCircle2 className="w-20 h-20 text-accent mx-auto animate-pulse" />
            <div className="space-y-1.5">
              <span className="inline-block bg-accent/20 border border-accent/30 rounded px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-accent">
                TRANSACTION SETTLED SUCCESSFUL
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-foreground">Order Confirmed!</h2>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Your payment has been cleared. An invoice summary has been generated for your record.
            </p>
          </div>

          {/* Copyable Tracking box */}
          <div className="p-5 border border-border bg-muted/20 rounded-2xl space-y-2.5 max-w-sm mx-auto text-left relative">
            <p className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Logistics Tracking Number</p>
            <div className="flex justify-between items-center gap-3">
              <span className="text-lg font-black tracking-wider text-foreground">{orderTrackingId}</span>
              <button
                onClick={handleCopyTracking}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-accent transition-colors duration-150"
              >
                {copied ? <span className="text-[10px] font-bold text-accent">Copied!</span> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full py-4 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2"
            >
              <span>Track in Dashboard</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => router.push('/')}
              className="w-full py-4 rounded-full border border-border bg-secondary hover:bg-muted text-foreground text-xs font-black uppercase tracking-widest"
            >
              Back to Boutique Mall
            </button>
          </div>

        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* ====================================================
              2. ACTIVE CHECKOUT STEP (LEFT COLUMN - 8 SPACES)
              ==================================================== */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Step indicators */}
            <div className="flex gap-2 items-center text-xs font-bold uppercase tracking-wide border-b border-border pb-4">
              <span className={step === 'address' ? 'text-accent' : 'text-muted-foreground'}>1. Address</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              <span className={step === 'shipping' ? 'text-accent' : 'text-muted-foreground'}>2. Shipping</span>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              <span className={step === 'payment' ? 'text-accent' : 'text-muted-foreground'}>3. Payment</span>
            </div>

            {/* STEP A: Address Inputs */}
            {step === 'address' && (
              <div className="bg-card border border-border p-6 rounded-3xl text-left space-y-5 glass-panel">
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Shipping Coordinates</h3>
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">Recipient Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Obinna Nwosu"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full border border-border bg-background rounded-xl p-3 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g. 14 Ikoyi Crescent"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      required
                      className="w-full border border-border bg-background rounded-xl p-3 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-muted-foreground">City</label>
                      <input
                        type="text"
                        placeholder="e.g. Lagos"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="w-full border border-border bg-background rounded-xl p-3 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-muted-foreground">State / Region</label>
                      <input
                        type="text"
                        placeholder="e.g. Lagos State"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        required
                        className="w-full border border-border bg-background rounded-xl p-3 text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-muted-foreground">Active Phone Contact</label>
                    <input
                      type="tel"
                      placeholder="e.g. +234 803 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full border border-border bg-background rounded-xl p-3 text-xs"
                    />
                  </div>

                </div>

                <div className="pt-4">
                  <button
                    onClick={handleNextStep}
                    disabled={!(fullName.trim() && street.trim() && city.trim() && stateName.trim() && phone.trim())}
                    className="px-8 py-3.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-wider shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Select Shipping Mode
                  </button>
                </div>
              </div>
            )}

            {/* STEP B: Shipping Logistics */}
            {step === 'shipping' && (
              <div className="bg-card border border-border p-6 rounded-3xl text-left space-y-5 glass-panel">
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Select Logistics Method</h3>
                
                <div className="space-y-3">
                  
                  {/* Option 1 */}
                  <label className={`flex justify-between items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                    shippingMethod === 'standard' ? 'border-accent bg-accent/5' : 'border-border/60 hover:bg-muted/40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="ship-method"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="accent-accent w-4.5 h-4.5"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-foreground">Standard ground shipping (Nigeria Post)</p>
                        <span className="text-muted-foreground">Estimated arrival within 3-5 business days</span>
                      </div>
                    </div>
                    <span className="text-sm font-black">₦2,000</span>
                  </label>

                  {/* Option 2 */}
                  <label className={`flex justify-between items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                    shippingMethod === 'priority' ? 'border-accent bg-accent/5' : 'border-border/60 hover:bg-muted/40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="ship-method"
                        checked={shippingMethod === 'priority'}
                        onChange={() => setShippingMethod('priority')}
                        className="accent-accent w-4.5 h-4.5"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-foreground">Priority Express air (Priority Logistc)</p>
                        <span className="text-muted-foreground">High speed prioritised delivery within 1-2 days</span>
                      </div>
                    </div>
                    <span className="text-sm font-black">₦5,000</span>
                  </label>

                  {/* Option 3 */}
                  <label className={`flex justify-between items-center p-4 border rounded-2xl cursor-pointer transition-all ${
                    shippingMethod === 'concierge' ? 'border-accent bg-accent/5' : 'border-border/60 hover:bg-muted/40'
                  }`}>
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="ship-method"
                        checked={shippingMethod === 'concierge'}
                        onChange={() => setShippingMethod('concierge')}
                        className="accent-accent w-4.5 h-4.5"
                      />
                      <div className="text-xs">
                        <p className="font-bold text-foreground">VIP Dedicated Concierge</p>
                        <span className="text-muted-foreground">Same-day courier (Lagos, Abuja local zones only)</span>
                      </div>
                    </div>
                    <span className="text-sm font-black">₦12,000</span>
                  </label>

                </div>

                <div className="pt-4 flex items-center justify-between border-t border-border/50 pt-4">
                  <button
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 text-xs font-black uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Coordinates</span>
                  </button>
                  <button
                    onClick={() => setStep('payment')}
                    className="px-8 py-3.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-wider shadow-md hover:brightness-105"
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}

            {/* STEP C: Card Payment */}
            {step === 'payment' && (
              <form onSubmit={handleSettleOrder} className="bg-card border border-border p-6 rounded-3xl text-left space-y-6 glass-panel">
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Secure Payment Gateway</h3>
                
                <div className="flex gap-4 border-b border-border/50 pb-4">
                  <label className={`flex-1 p-3.5 border rounded-xl flex items-center gap-2.5 cursor-pointer select-none transition-all ${
                    paymentOption === 'card' ? 'border-accent bg-accent/5 text-accent' : 'border-border/60 text-muted-foreground'
                  }`}>
                    <input
                      type="radio"
                      name="pay-opt"
                      checked={paymentOption === 'card'}
                      onChange={() => setPaymentOption('card')}
                      className="accent-accent"
                    />
                    <CreditCard className="w-4.5 h-4.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Credit Card</span>
                  </label>

                  <label className={`flex-1 p-3.5 border rounded-xl flex items-center gap-2.5 cursor-pointer select-none transition-all ${
                    paymentOption === 'transfer' ? 'border-accent bg-accent/5 text-accent' : 'border-border/60 text-muted-foreground'
                  }`}>
                    <input
                      type="radio"
                      name="pay-opt"
                      checked={paymentOption === 'transfer'}
                      onChange={() => setPaymentOption('transfer')}
                      className="accent-accent"
                    />
                    <Truck className="w-4.5 h-4.5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Bank Transfer</span>
                  </label>
                </div>

                {paymentOption === 'card' ? (
                  <div className="p-5 border border-accent/25 bg-accent/5 rounded-2xl space-y-4 text-left">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-accent animate-pulse" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-accent">Integrated Paystack Gateway (Test Mode Enabled)</h4>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Experience secure transaction settling. When you click authorize below, the official **Paystack Test Checkout** will open directly as a secure overlay in your browser.
                    </p>
                    <div className="bg-muted/40 p-3 rounded-xl text-[11px] font-semibold text-muted-foreground space-y-1">
                      <p>💳 Supports: Mastercard, Visa, Verve cards</p>
                      <p>🏦 Test Method: Select "Success" inside the popup to approve simulated checkout.</p>
                    </div>
                    {paystackError && (
                      <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3 rounded-xl font-bold">
                        ⚠️ {paystackError}
                      </div>
                    )}
                    {payingWithPaystack && (
                      <div className="text-xs font-black text-accent uppercase tracking-widest flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        <span>Opening Paystack Checkout Portal...</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 border border-accent/20 bg-accent/5 rounded-2xl text-xs text-muted-foreground space-y-2 leading-relaxed">
                    <h5 className="font-bold text-accent uppercase tracking-wider">Direct Bank Transfer Instructions:</h5>
                    <p>Settle payment directly to our secure client account:</p>
                    <p className="font-bold text-foreground">
                      Bank Name: GTBank Nigeria<br />
                      Account Name: Zoko Luxury Express LTD<br />
                      Account Number: 0123456789
                    </p>
                    <p>Kindly compile the invoice order tracking ID in transaction transfer remarks.</p>
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-border/50">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center gap-1.5 text-xs font-black uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Logistics</span>
                  </button>
                  
                  <button
                    type="submit"
                    className="px-8 py-3.5 rounded-full gold-gradient text-white text-xs font-black uppercase tracking-widest shadow-lg hover:brightness-105 active:scale-95 flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-4.5 h-4.5" />
                    <span>Authorize Transaction</span>
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* ====================================================
              3. BILLING SUMMARY & ORDER ITEMS (RIGHT COLUMN)
              ==================================================== */}
          <aside className="lg:col-span-4 space-y-6 sticky top-28">
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm glass-panel text-left space-y-5">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border pb-3">
                <ShoppingBag className="w-4.5 h-4.5 text-accent" />
                <span>Bag Summary ({totalCartQty})</span>
              </h3>

              {/* Items preview list */}
              <div className="space-y-3.5 max-h-48 overflow-y-auto no-scrollbar border-b border-border pb-4">
                {cartItems.map((item) => {
                  const price = item.variant
                    ? (item.variant.sale_price || item.variant.price)
                    : (item.product.sale_price || item.product.price);
                  return (
                    <div key={`${item.product.id}-${item.variant?.id || 'base'}`} className="flex justify-between items-center gap-2 text-xs">
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate max-w-[150px]">{item.product.name}</p>
                        <span className="text-[10px] text-muted-foreground uppercase font-black">Qty {item.quantity}</span>
                      </div>
                      <span className="font-black text-foreground flex-shrink-0">
                        ₦{(price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Coordinates recap */}
              {fullName.trim() && (
                <div className="space-y-1.5 text-xs text-muted-foreground border-b border-border pb-4">
                  <h4 className="font-bold text-foreground uppercase text-[10px] tracking-wider">Shipping Destination</h4>
                  <p className="leading-relaxed font-semibold">
                    {fullName}<br />
                    {street}, {city}<br />
                    {stateName}, Nigeria<br />
                    {phone}
                  </p>
                </div>
              )}

              {/* Settle breakdown */}
              <div className="space-y-3.5 border-b border-border/50 pb-4 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">₦{cartSubtotal.toLocaleString()}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-accent">
                    <span>Coupon Deductions</span>
                    <span>-₦{cartDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated VAT (7.5%)</span>
                  <span className="text-foreground">₦{cartTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping Logistics ({getShippingLabel()})</span>
                  <span className="text-foreground">₦{getShippingCost().toLocaleString()}</span>
                </div>
              </div>

              {/* final grand total */}
              <div className="flex justify-between items-baseline pt-1.5">
                <span className="text-sm font-bold text-foreground">Grand Total</span>
                <span className="text-xl font-black text-gold-gradient">
                  ₦{finalTotal.toLocaleString()}
                </span>
              </div>

            </div>
          </aside>

        </div>
      )}

    </div>
  );
}
