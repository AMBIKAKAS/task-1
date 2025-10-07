'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import PasswordGenerator from '@/components/PasswordGenerator';
import VaultList from '@/components/VaultList';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [userPassword, setUserPassword] = useState<string | null>(null);
  const [generatedPassword, setGeneratedPassword] = useState<string>('');

  const [passwordInput, setPasswordInput] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handlePasswordGenerated = (password: string) => {
    setGeneratedPassword(password);
  };

  const handlePasswordUsed = () => {
    setGeneratedPassword('');
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleUnlockVault = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);

    // In a real app, you'd verify this password against the user's actual password
    // For this demo, we'll assume the password is correct if it's not empty
    if (passwordInput.length >= 6) {
      setUserPassword(passwordInput);
      toast.success('Vault unlocked successfully!');
    } else {
      toast.error('Please enter a valid password (minimum 6 characters)');
    }
    
    setVerifying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">Password Vault</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <User size={20} className="mr-2" />
                <span className="text-sm">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut size={20} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Password Generator - Left Column */}
          <div className="lg:col-span-1">
            <PasswordGenerator onPasswordGenerated={handlePasswordGenerated} />
          </div>

          {/* Vault - Right Columns */}
          <div className="lg:col-span-2">
            {!userPassword ? (
              // Password prompt to unlock vault
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Shield className="mx-auto h-16 w-16 text-blue-600 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Unlock Your Vault</h2>
                <p className="text-gray-600 mb-6">
                  Enter your account password to decrypt and access your saved passwords.
                </p>
                
                <form onSubmit={handleUnlockVault} className="max-w-sm mx-auto">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    required
                  />
                  <button
                    type="submit"
                    disabled={verifying}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {verifying ? 'Verifying...' : 'Unlock Vault'}
                  </button>
                </form>

                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                  <p className="text-sm text-blue-800">
                    <strong>Security:</strong> Your vault data is encrypted with your password. 
                    We cannot recover your data if you forget your password.
                  </p>
                </div>
              </div>
            ) : (
              // Show vault when unlocked
              <VaultList 
                userPassword={userPassword}
                generatedPassword={generatedPassword}
                onPasswordUsed={handlePasswordUsed}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}