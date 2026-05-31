'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, Check, Sparkles, AlertCircle, KeyRound, User, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock avatars from high-quality curated Unsplash resources
const MOCK_PROFILES = {
  google: [
    {
      name: 'Alex Gold',
      email: 'alex.gold@zoko.vip',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
    },
    {
      name: 'Sophia Luxury',
      email: 'sophia.luxury@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    },
    {
      name: 'Chinedu Okafor',
      email: 'chinedu.o@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
    }
  ],
  facebook: [
    {
      name: 'Obinna Nwosu',
      email: 'obinna.n@facebook.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150',
    }
  ]
};

function MockOauthContent() {
  const searchParams = useSearchParams();
  const providerParam = searchParams.get('provider') || 'google';
  const provider = providerParam === 'facebook' ? 'facebook' : 'google';

  const [selectedAccount, setSelectedAccount] = useState<typeof MOCK_PROFILES['google'][0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('');
  const [success, setSuccess] = useState(false);
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customError, setCustomError] = useState('');

  // Handle selected account submission
  const handleProceedWithProfile = async (profile: typeof MOCK_PROFILES['google'][0]) => {
    setSelectedAccount(profile);
    setLoading(true);
    
    // Simulate secure hand-shake phases
    setLoadingPhase('Connecting to identity server...');
    await new Promise(r => setTimeout(r, 600));
    
    setLoadingPhase('Verifying cryptographic claims token...');
    await new Promise(r => setTimeout(r, 600));
    
    setLoadingPhase('Completing secure routing...');
    await new Promise(r => setTimeout(r, 400));
    
    setLoading(false);
    setSuccess(true);
    await new Promise(r => setTimeout(r, 500));

    // Communicate back to parent window
    if (window.opener) {
      window.opener.postMessage(
        {
          type: 'MOCK_OAUTH_SUCCESS',
          user: {
            id: `usr-${Math.random().toString(36).substr(2, 9)}`,
            email: profile.email,
            fullName: profile.name,
            avatarUrl: profile.avatar
          }
        },
        window.location.origin
      );
      window.close();
    } else {
      // Safe fallback if opened outside popup
      alert(`Simulated Login Success for:\nName: ${profile.name}\nEmail: ${profile.email}\n\n(Tip: Open this via the Zoko Mall Login page to complete authentications!)`);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomError('');

    if (!customName.trim() || !customEmail.trim()) {
      setCustomError('Please provide both full name and email.');
      return;
    }

    if (!customEmail.includes('@')) {
      setCustomError('Please provide a valid email coordinate.');
      return;
    }

    const newProfile = {
      name: customName.trim(),
      email: customEmail.trim().toLowerCase(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150' // default premium avatar
    };

    handleProceedWithProfile(newProfile);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-card border border-border p-6 rounded-3xl shadow-2xl relative z-10 glass-panel space-y-6 overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/10 rounded-full blur-xl pointer-events-none" />

      {/* Header section depending on provider */}
      <div className="text-center space-y-4 pt-2">
        {provider === 'google' ? (
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 mb-1">
              {/* Google Premium Multicolor G Icon */}
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Sign in with Google</h2>
            <p className="text-xs text-muted-foreground">
              to continue to <span className="font-bold text-foreground">Zoko Luxury Mall</span>
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] shadow-md mb-1 text-white font-black text-2xl">
              f
            </div>
            <h2 className="text-xl font-bold tracking-tight text-foreground font-sans">Log in with Facebook</h2>
            <p className="text-xs text-muted-foreground">
              Authorize account pipeline connection to <span className="font-bold text-foreground">Zoko Mall</span>
            </p>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
            <div className="space-y-1.5">
              <p className="text-xs font-black uppercase tracking-widest text-accent animate-pulse">
                Secure Handshake
              </p>
              <p className="text-xs text-muted-foreground min-h-[16px]">{loadingPhase}</p>
            </div>
          </motion.div>
        ) : success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="py-12 flex flex-col items-center justify-center space-y-3 text-center"
          >
            <div className="w-14 h-14 bg-accent/20 border border-accent/40 rounded-full flex items-center justify-center text-accent">
              <ShieldCheck className="w-8 h-8 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground">Authorized Soundly!</h3>
              <p className="text-xs text-muted-foreground mt-1">Exchanging secure identity profile keys...</p>
            </div>
          </motion.div>
        ) : showCustomForm ? (
          <motion.div
            key="custom-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Custom Identity Keys</span>
              <button 
                type="button" 
                onClick={() => setShowCustomForm(false)} 
                className="text-[9px] uppercase font-black text-accent hover:underline"
              >
                Back to profiles
              </button>
            </div>

            {customError && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[11px] p-3 rounded-xl font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>{customError}</span>
              </div>
            )}

            <form onSubmit={handleCustomSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Obinna K. Adeleke"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background/50 focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent text-xs font-semibold"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-muted-foreground">Email Coordinates</label>
                <input
                  type="email"
                  placeholder="e.g. obinna@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background/50 focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent text-xs font-semibold"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl gold-gradient text-white text-xs font-black uppercase tracking-widest hover:brightness-105 active:scale-98 transition-all"
              >
                Accept and Continue
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="account-selector"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Disclaimer notification box */}
            <div className="bg-accent/10 border border-accent/20 rounded-2xl p-3 text-[10px] text-accent flex gap-2 text-left">
              <KeyRound className="w-4.5 h-4.5 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block uppercase tracking-wide text-[9px] text-foreground">Sandbox Security Sandbox</span>
                <span className="text-muted-foreground leading-relaxed">
                  Supabase database variables are not detected. Displaying verified local simulation pipeline to validate complete authentication routes.
                </span>
              </div>
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block text-left">
              Choose an account to continue
            </span>

            {/* Profile List */}
            <div className="space-y-2.5">
              {MOCK_PROFILES[provider].map((profile, i) => (
                <button
                  key={i}
                  onClick={() => handleProceedWithProfile(profile)}
                  className="w-full flex items-center justify-between p-3 rounded-xl border border-border/80 bg-background/40 hover:bg-background/80 hover:border-accent/40 text-left transition-all duration-200 group active:scale-99 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-9 h-9 rounded-full object-cover border border-border group-hover:border-accent/30"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-foreground truncate group-hover:text-accent">
                        {profile.name}
                      </h4>
                      <p className="text-[10px] text-muted-foreground truncate">{profile.email}</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border border-border flex items-center justify-center text-transparent group-hover:border-accent group-hover:text-accent transition-colors bg-card">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}

              {/* Action to add mock account */}
              <button
                onClick={() => setShowCustomForm(true)}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-dashed border-border hover:border-accent/50 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-accent transition-all duration-200"
              >
                <User className="w-4 h-4" />
                <span>Use custom test profile</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Permissions Disclaimer */}
      <div className="pt-4 border-t border-border flex justify-between items-center text-[9px] text-muted-foreground select-none">
        <span className="flex items-center gap-1">
          <Lock className="w-3 h-3 text-accent" />
          <span>Cryptographic claim token verified</span>
        </span>
        <span>Secure HTTPS Connection</span>
      </div>
    </div>
  );
}

export default function MockOauthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-background text-foreground font-sans">
      
      {/* Dynamic Animated Orbs */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-accent/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-zinc-900/30 rounded-full filter blur-[100px] pointer-events-none" />
      
      <Suspense fallback={
        <div className="w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-2xl glass-panel text-center space-y-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase font-black tracking-widest text-muted-foreground">Loading identity context...</p>
        </div>
      }>
        <MockOauthContent />
      </Suspense>
    </div>
  );
}
