import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
  dbConfirmed?: boolean;
}

interface AuthStore {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  
  signIn: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signUp: (email: string, password: string, fullName?: string, phone?: string) => Promise<{ success: boolean; message: string }>;
  signInWithOAuth: (provider: 'google' | 'facebook') => Promise<{ success: boolean; message?: string; isMock?: boolean }>;
  setOAuthUser: (profile: UserProfile) => void;
  signOut: () => Promise<void>;
  initialize: () => () => void;
}

const getLocalUser = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const u = localStorage.getItem('zoko_user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};

const setLocalUser = (u: UserProfile | null): void => {
  if (typeof window === 'undefined') return;
  try {
    if (u) localStorage.setItem('zoko_user', JSON.stringify(u));
    else localStorage.removeItem('zoko_user');
  } catch {}
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: getLocalUser(),
  loading: false,
  error: null,

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.auth.signInWithPassword({ email, password });
      if (error) {
        set({ loading: false, error: error.message });
        return { success: false, message: error.message };
      }
      
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || email.split('@')[0]
      };
      
      set({ user: profile, loading: false });
      setLocalUser(profile);
      return { success: true, message: 'Logged in successfully via Supabase!' };
    }

    // Mock Login Simulation
    const mockUsers = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('zoko_mock_users') || '[]') : [];
    const matched = mockUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    
    if (matched && matched.password !== password) {
      set({ loading: false, error: 'Incorrect password for this simulated account.' });
      return { success: false, message: 'Incorrect password.' };
    }

    const profile: UserProfile = {
      id: matched?.id || `usr-${Math.random().toString(36).substr(2, 9)}`,
      email,
      fullName: matched?.fullName || email.split('@')[0]
    };

    set({ user: profile, loading: false });
    setLocalUser(profile);
    return { success: true, message: 'Logged in successfully via Local Simulation!' };
  },

  signUp: async (email, password, fullName, phone) => {
    set({ loading: true, error: null });

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0],
            phone: phone || ''
          }
        }
      });
      if (error) {
        set({ loading: false, error: error.message });
        return { success: false, message: error.message };
      }
      
      // Sync phone number to the public profiles table in Supabase
      if (data.user) {
        try {
          await supabase!
            .from('profiles')
            .update({ 
              phone: phone || '',
              full_name: fullName || email.split('@')[0]
            })
            .eq('id', data.user.id);
        } catch (dbErr) {
          console.warn('PostgreSQL profiles phone update failed:', dbErr);
        }
      }

      const profile: UserProfile = {
        id: data.user?.id || '',
        email: data.user?.email || email,
        fullName: fullName || email.split('@')[0],
        role: 'customer',
        dbConfirmed: true
      };
      
      set({ user: profile, loading: false });
      setLocalUser(profile);
      return { success: true, message: 'Signed up successfully!' };
    }

    // Mock Signup Simulation
    const mockUsers = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('zoko_mock_users') || '[]') : [];
    const exists = mockUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      set({ loading: false, error: 'An account with this email address already exists.' });
      return { success: false, message: 'Account already exists.' };
    }

    const newUser = {
      id: `usr-${Math.random().toString(36).substr(2, 9)}`,
      email,
      password,
      fullName: fullName || email.split('@')[0],
      phone: phone || '',
      role: 'customer',
      dbConfirmed: true,
      createdAt: new Date().toISOString()
    };

    mockUsers.push(newUser);
    localStorage.setItem('zoko_mock_users', JSON.stringify(mockUsers));

    const profile: UserProfile = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      role: 'customer',
      dbConfirmed: true
    };

    set({ user: profile, loading: false });
    setLocalUser(profile);
    return { success: true, message: 'Account created successfully in Local Simulation!' };
  },

  signOut: async () => {
    if (isSupabaseConfigured()) {
      await supabase!.auth.signOut();
    }
    set({ user: null });
    setLocalUser(null);
  },

  initialize: () => {
    if (!isSupabaseConfigured()) return () => {};

    const { data: { subscription } } = supabase!.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        let dbFullName = session.user.user_metadata?.full_name || '';
        let dbAvatarUrl = session.user.user_metadata?.avatar_url || '';
        let dbRole = 'customer';

        try {
          // Query the live PostgreSQL public.profiles table to confirm database sync
          const { data, error } = await supabase!
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!error && data) {
            dbFullName = data.full_name || dbFullName;
            dbAvatarUrl = data.avatar_url || dbAvatarUrl;
            dbRole = data.role || dbRole;
          }
        } catch (err) {
          console.warn('PostgreSQL public.profiles sync verification failed:', err);
        }

        const profile: UserProfile = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: dbFullName || session.user.email?.split('@')[0],
          avatarUrl: dbAvatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(dbFullName || 'User')}`,
          role: dbRole,
          dbConfirmed: true
        };
        set({ user: profile });
        setLocalUser(profile);
      } else {
        set({ user: null });
        setLocalUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  },

  signInWithOAuth: async (provider) => {
    set({ loading: true, error: null });
    
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase!.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) {
        set({ loading: false, error: error.message });
        return { success: false, message: error.message };
      }
      if (data?.url && typeof window !== 'undefined') {
        window.location.href = data.url;
      }
      return { success: true };
    }

    set({ loading: false });
    return { success: true, isMock: true };
  },

  setOAuthUser: (profile) => {
    // Simulated database write confirmation for local sandbox testing
    if (typeof window !== 'undefined') {
      const mockUsers = JSON.parse(localStorage.getItem('zoko_mock_users') || '[]');
      const exists = mockUsers.some((u: any) => u.email.toLowerCase() === profile.email.toLowerCase());
      if (!exists) {
        mockUsers.push({
          id: profile.id,
          email: profile.email,
          fullName: profile.fullName || profile.email.split('@')[0],
          avatarUrl: profile.avatarUrl,
          role: 'customer',
          dbConfirmed: true,
          provider: profile.email.includes('facebook') ? 'facebook' : 'google',
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('zoko_mock_users', JSON.stringify(mockUsers));
      }
    }

    const confirmedProfile: UserProfile = {
      ...profile,
      role: 'customer',
      dbConfirmed: true
    };

    set({ user: confirmedProfile, loading: false });
    setLocalUser(confirmedProfile);
  }
}));
