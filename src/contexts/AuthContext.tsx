'use client';

import { createContext, useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AuthContextType } from '@/lib/types';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast.success('로그인 성공!');
      router.push('/chat');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast.success('로그아웃되었습니다.');
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('로그아웃에 실패했습니다.');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
