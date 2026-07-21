'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faSpinner, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth!, email, password);
      const firebaseUser = userCredential.user;
      
      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Verify user exists in backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('User not found in system');
      }
      
      const data = await response.json();
      
      // Check if user has shop_owner or admin role
      if (data.data.role !== 'shop_owner' && data.data.role !== 'admin') {
        throw new Error('Access denied. Shop owner account required.');
      }
      
      // Store token in localStorage for API calls
      localStorage.setItem('token', idToken);
      localStorage.setItem('shopId', data.data.id);
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="ZniyerBuy" width={100} height={100} className="w-20 h-20 sm:w-24 sm:h-24" style={{ width: 'auto', height: 'auto' }} loading="eager" priority />
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3 tracking-wide">
            <span style={{ color: '#E84E0F' }}>ZNIYER</span>
            <span style={{ color: '#2A7F8A' }}> BuY</span>
          </h1>
          <p className="text-xs mt-1 tracking-widest text-center" style={{ color: '#4A4A4A' }}>
            BRINGING THE CART TO YOUR DOORSTEP
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 sm:p-8 shadow-2xl" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
          <h2 className="text-xl font-bold text-white text-center mb-6">
            Shop Owner Login
          </h2>

          {error && (
            <div className="p-3 rounded-lg mb-4 text-sm text-center" style={{ backgroundColor: '#2A0A0A', color: '#FF6B6B' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#2A7F8A' }}>
                <FontAwesomeIcon icon={faEnvelope} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 transition"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A7F8A' }}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#2A7F8A' }}>
                <FontAwesomeIcon icon={faLock} />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:ring-2 transition"
                  style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A7F8A' }}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#888888' }}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white transition hover:opacity-90 disabled:opacity-50 mt-6 flex items-center justify-center gap-2"
              style={{ backgroundColor: '#E84E0F' }}>
              {loading && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: '#555555' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-semibold hover:underline transition" style={{ color: '#2A7F8A' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
