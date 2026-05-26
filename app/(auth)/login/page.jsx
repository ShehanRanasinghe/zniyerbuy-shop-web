'use client';

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D1B2A' }}>
      <div className="w-full max-w-md px-6">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/LOGO.PNG.jpg" alt="ZniyerBuy" width={80} height={80} />
          <h1 className="text-3xl font-extrabold mt-3 tracking-wide">
            <span className="text-white">ZNIYER</span>
            <span style={{ color: '#F5A623' }}>BUY</span>
          </h1>
          <p className="text-sm mt-1" style={{ color: '#00897B' }}>
            — SHOP SMART, DELIVERED FAST —
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: '#132333' }}>
          <h2 className="text-xl font-bold text-white text-center mb-6">
            Shop Owner Login
          </h2>

          {error && (
            <div className="bg-red-500 bg-opacity-20 text-red-400 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#00897B' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1E3448', borderColor: '#00897B', border: '1px solid #00897B' }}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#00897B' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2"
                style={{ backgroundColor: '#1E3448', border: '1px solid #00897B' }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white transition hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ backgroundColor: '#00897B' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: '#8899AA' }}>
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold hover:underline" style={{ color: '#F5A623' }}>
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}