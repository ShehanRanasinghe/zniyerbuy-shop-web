'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A0A0A' }}>
      <div className="w-full max-w-md px-6">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="ZniyerBuy" width={100} height={100} />
          <h1 className="text-3xl font-extrabold mt-3 tracking-wide">
            <span style={{ color: '#E84E0F' }}>ZNIYER</span>
            <span style={{ color: '#2A7F8A' }}> BuY</span>
          </h1>
          <p className="text-xs mt-1 tracking-widest" style={{ color: '#4A4A4A' }}>
            BRINGING THE CART TO YOUR DOORSTEP
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 shadow-2xl" style={{ backgroundColor: '#111111', border: '1px solid #222222' }}>
          <h2 className="text-xl font-bold text-white text-center mb-6">
            Create Account
          </h2>

          {error && (
            <div className="p-3 rounded-lg mb-4 text-sm text-center" style={{ backgroundColor: '#2A0A0A', color: '#FF6B6B' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2A7F8A' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-white focus:outline-none"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A7F8A' }}
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2A7F8A' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-white focus:outline-none"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A7F8A' }}
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2A7F8A' }}>
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-white focus:outline-none"
                style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A7F8A' }}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white transition hover:opacity-90 disabled:opacity-50 mt-2"
              style={{ backgroundColor: '#E84E0F' }}
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm mt-5" style={{ color: '#555555' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: '#2A7F8A' }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}