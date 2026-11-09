import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, getSupabaseConfig } from '../lib/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoUser, setIsDemoUser] = useState(false);

  useEffect(() => {
    // Check if demo user was logged in
    const storedDemo = localStorage.getItem('shikhon_demo_admin') === 'true';
    if (storedDemo) {
      setUser({
        id: 'demo-admin-id',
        email: 'admin@shikhon-parts.com',
        user_metadata: { name: 'Admin Demo' }
      });
      setIsDemoUser(true);
      setLoading(false);
      return;
    }

    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loginWithPassword = async (email, password) => {
    if (!supabase) {
      throw new Error('Supabase is not configured. Please enter your Supabase Project URL and Anon Key.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setIsDemoUser(false);
    localStorage.removeItem('shikhon_demo_admin');
    return data;
  };

  const loginAsDemo = () => {
    const demoUser = {
      id: 'demo-admin-id',
      email: 'admin@shikhon-parts.com',
      user_metadata: { name: 'Admin Demo' }
    };
    setUser(demoUser);
    setIsDemoUser(true);
    localStorage.setItem('shikhon_demo_admin', 'true');
  };

  const logout = async () => {
    if (isDemoUser) {
      setUser(null);
      setIsDemoUser(false);
      localStorage.removeItem('shikhon_demo_admin');
    } else if (supabase) {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isDemoUser,
      isAuthenticated: Boolean(user),
      loginWithPassword,
      loginAsDemo,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
