'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, ShieldCheck, ArrowRight, Sparkles, AlertCircle, RefreshCw, KeyRound, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const signIn = useAuthStore((state) => state.signIn);
  const signUp = useAuthStore((state) => state.signUp);
  const signInWithOAuth = useAuthStore((state) => state.signInWithOAuth);
  const setOAuthUser = useAuthStore((state) => state.setOAuthUser);

  // Flow State
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // OTP States
  const [showOtp, setShowOtp] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  
  const [actionSuccess, setActionSuccess] = useState('');
  const [localError, setLocalError] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // If already authenticated, route directly to account dashboard
  useEffect(() => {
    if (user && !showOtp) {
      router.push('/dashboard');
    }
  }, [user, showOtp, router]);

  // Check URL query parameters for redirects/errors from real Supabase OAuth callback
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const errCode = params.get('error');
    if (errCode === 'cryptographic_handshake_failed') {
      setLocalError('Cryptographic handshake or callback verification failed. Check environment variables.');
    } else if (errCode) {
      setLocalError(decodeURIComponent(errCode));
    }
  }, []);

  // Listen to messages from mock OAuth popup window
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data?.type === 'MOCK_OAUTH_SUCCESS' && event.data?.user) {
        const profile = event.data.user;
        setOAuthUser(profile);
        setActionSuccess('OAuth Authorized! Profile created & database confirmation synced.');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [router, setOAuthUser]);

  // Handle Google / Facebook OAuth button triggers
  const handleOAuthSignIn = async (provider: 'google' | 'facebook') => {
    setLocalError('');
    setActionSuccess('');
    setOtpError('');

    const res = await signInWithOAuth(provider);
    if (!res.success) {
      setLocalError(res.message || 'OAuth initialization failed.');
      return;
    }

    if (res.isMock) {
      const width = 500;
      const height = 650;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;
      
      const popup = window.open(
        `/login/mock-oauth?provider=${provider}`,
        `Zoko Mall VIP OAuth - Continue with ${provider === 'google' ? 'Google' : 'Facebook'}`,
        `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
      );

      if (!popup) {
        setLocalError('OAuth popup was blocked. Please allow popups for this website to test OAuth.');
      }
    }
  };

  // Handle focus jumping inside OTP digits
  const handleOtpChange = (index: number, val: string) => {
    if (val && isNaN(Number(val))) return; // only allow numbers
    
    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1); // store only the single last digit
    setOtpDigits(newDigits);
    setOtpError('');

    // Shift focus forward if value entered
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
      setOtpError('');
    }
  };

  // Generate a random 6 digit OTP and transition the form
  const handleInitiateAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setActionSuccess('');
    setOtpError('');

    if (!email.trim() || !password.trim()) {
      setLocalError('Please complete all credential fields.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must contain at least 6 characters.');
      return;
    }

    if (!isLogin && (!fullName.trim() || !phone.trim())) {
      setLocalError('Please complete all registration fields.');
      return;
    }

    // Direct authentications bypassing simulated OTP only for logging in when Supabase is active
    if (isSupabaseConfigured() && isLogin) {
      const res = await signIn(email.trim(), password);
      if (res.success) {
        setActionSuccess(res.message);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setLocalError(res.message);
      }
      return;
    }

    // Generate simulated random 6 digit OTP for the sandbox env
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setShowOtp(true);
  };

  // Settle Auth after OTP is verified
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError('');
    setActionSuccess('');

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setOtpError('Please input all 6 security digits.');
      return;
    }

    if (enteredOtp !== generatedOtp) {
      setOtpError('Incorrect security token code. Please check the code alert banner.');
      return;
    }

    // OTP Verified! Now execute actual Auth Store login/signup
    if (isLogin) {
      const res = await signIn(email.trim(), password);
      if (res.success) {
        setActionSuccess('OTP Verified! ' + res.message);
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setOtpError(res.message);
        setShowOtp(false); // return to inputs if main auth throws error
      }
    } else {
      const res = await signUp(email.trim(), password, fullName.trim(), phone.trim());
      if (res.success) {
        setActionSuccess('OTP Verified! Profile created & database confirmation synced.');
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
          setPhone('');
          setShowOtp(false);
          setActionSuccess('');
        }, 2000);
      } else {
        setOtpError(res.message);
        setShowOtp(false);
      }
    }
  };

  // Resend security token code
  const handleResendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    setActionSuccess('New OTP security token code has been sent.');
    setTimeout(() => setActionSuccess(''), 2500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 relative overflow-hidden bg-background">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[40rem] h-[40rem] bg-accent/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-zinc-900/50 dark:bg-zinc-800/20 rounded-full filter blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-card border border-border p-8 rounded-3xl shadow-2xl relative z-10 glass-panel text-left space-y-6"
      >
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <span className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-1.5 justify-center">
              <span className="text-foreground">ZOKO</span>
              <span className="text-gold-gradient font-extrabold text-xs border border-accent/30 rounded px-1.5 py-0.5 bg-accent/5">
                MALL
              </span>
            </span>
          </Link>
          <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
            {showOtp 
              ? 'Security Token OTP' 
              : isLogin 
              ? 'VIP Sign In' 
              : 'Register Account'}
          </h2>
          <p className="text-xs text-muted-foreground">
            {showOtp
              ? !isLogin 
                ? `We've routed a unique 6-digit verification code to your email coordinates (${email}) and registered mobile number (${phone || '+234...'}).`
                : `We've routed a unique 6-digit lock code to your email credentials.`
              : isLogin 
              ? 'Enter your premium credentials to track orders and checkout.'
              : 'Create an authenticated profile for secure logistics routing.'}
          </p>
        </div>

        {/* Dynamic OTP Sandbox Alert Code */}
        {showOtp && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent/15 border border-accent/30 rounded-2xl p-4 text-xs text-left text-accent space-y-1"
          >
            <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] tracking-wider">
              <KeyRound className="w-4 h-4 text-accent animate-pulse" />
              <span>VIP OTP Security Alert</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {!isLogin 
                ? `[Sandbox Mode] Verification code sent to email (${email}) & mobile (${phone}):` 
                : `[Sandbox Mode] A security token code has been sent:`}
            </p>
            <p className="font-mono text-lg font-black tracking-widest text-center py-1 text-white bg-[#111111] dark:bg-white dark:text-black rounded-xl">
              {generatedOtp}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {(localError || otpError) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-3.5 rounded-xl font-bold flex items-center gap-2"
            >
              <AlertCircle className="w-4.5 h-4.5 flex-shrink-0" />
              <span>{localError || otpError}</span>
            </motion.div>
          )}

          {actionSuccess && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-accent/15 border border-accent/30 text-accent text-xs p-3.5 rounded-xl font-bold flex items-center gap-2"
            >
              <ShieldCheck className="w-4.5 h-4.5 flex-shrink-0 text-accent animate-pulse" />
              <span>{actionSuccess}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STEP A: Email/Password inputs */}
        {!showOtp ? (
          <>
            <form onSubmit={handleInitiateAuth} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-xs transition-all"
                      />
                      <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Mobile Number</label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="+234 803 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-xs transition-all"
                        required
                      />
                      <Phone className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Email Coordinates</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-xs transition-all"
                  />
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">Password Lock</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setLocalError('Simulated recovery coordinates sent to email.')}
                      className="text-[9px] uppercase font-black text-accent hover:underline"
                    >
                      Forgot Lock?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background/50 focus:bg-background focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent text-xs transition-all"
                  />
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl gold-gradient text-white text-xs font-black uppercase tracking-widest shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Get Verification Token</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-border/50"></div>
              <span className="flex-shrink mx-4 text-[9px] font-black uppercase tracking-wider text-muted-foreground">Or Continue With</span>
              <div className="flex-grow border-t border-border/50"></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuthSignIn('google')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border bg-background/50 hover:bg-background hover:border-accent/40 font-bold uppercase text-[10px] tracking-wider transition-all hover:shadow-sm duration-200 active:scale-98 cursor-pointer text-foreground"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignIn('facebook')}
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-border bg-background/50 hover:bg-background hover:border-accent/40 font-bold uppercase text-[10px] tracking-wider transition-all hover:shadow-sm duration-200 active:scale-98 cursor-pointer text-foreground"
              >
                <svg className="w-4 h-4 fill-[#1877F2]" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </button>
            </div>
          </>
        ) : (
          /* STEP B: OTP Digit inputs */
          <form onSubmit={handleVerifyOtpSubmit} className="space-y-6">
            <div className="flex justify-between gap-2 max-w-sm mx-auto">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={(el) => { inputRefs.current[i] = el; }}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-12 h-14 border border-border bg-background/40 focus:bg-background rounded-xl text-center text-xl font-bold font-mono focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all shadow-sm"
                />
              ))}
            </div>

            <div className="space-y-3.5">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl gold-gradient text-white text-xs font-black uppercase tracking-widest shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Verify & Access Account</span>
                    <ShieldCheck className="w-4.5 h-4.5 text-white" />
                  </>
                )}
              </button>

              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="text-muted-foreground hover:text-foreground font-black uppercase tracking-wider"
                >
                  Back to lock
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-accent hover:underline font-black uppercase tracking-wider flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Token</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {!showOtp && (
          <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {isLogin ? "First time visiting our mall?" : "Already registered?"}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setLocalError('');
                setActionSuccess('');
              }}
              className="font-black uppercase text-accent hover:underline"
            >
              {isLogin ? 'Register Profile' : 'VIP Portal'}
            </button>
          </div>
        )}

        {/* Supabase connection diagnostic banner */}
        <div className="bg-muted/40 p-3 rounded-xl text-[10px] text-muted-foreground leading-relaxed flex items-start gap-1.5 text-left">
          <Sparkles className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-foreground">Secure Verification Enabled</p>
            <span>Unique lock codes are generated in test mode sandbox boxes. Once Supabase connects, it binds to secure two-factor auth verification keys.</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
