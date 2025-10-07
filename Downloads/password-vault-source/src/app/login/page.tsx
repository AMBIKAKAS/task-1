'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const { user, login, register, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleSubmit = async (email: string, password: string): Promise<boolean> => {
    if (mode === 'login') {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      }
      return success;
    } else {
      const success = await register(email, password);
      if (success) {
        router.push('/dashboard');
      }
      return success;
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (user) {
    return null; // Will redirect
  }

  return (
    <AuthForm
      mode={mode}
      onSubmit={handleSubmit}
      onToggleMode={toggleMode}
    />
  );
}