'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Mail, Lock, ArrowRight, MapPin, Briefcase, ShoppingBag } from 'lucide-react';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('buyer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, role);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 hidden lg:flex relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDM2YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 w-full">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-4 rounded-2xl mb-6 shadow-2xl shadow-emerald-500/50">
            <MapPin className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Join BhuDeals</h2>
          <p className="text-xl text-slate-300 max-w-md">
            Create your account and get instant access to thousands of premium land listings.
          </p>

          <div className="mt-12 grid grid-cols-3 gap-6 max-w-2xl">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">2,500+</div>
              <div className="text-sm text-slate-400">Properties</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">50+</div>
              <div className="text-sm text-slate-400">Districts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400 mb-2">98%</div>
              <div className="text-sm text-slate-400">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-10 border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2">Create Account</h2>
              <p className="text-slate-600">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-12"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-12"
                    placeholder="Min. 8 characters"
                    required
                    minLength={8}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5 ml-1">Must be at least 8 characters</p>
              </div>

              <div>
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input-field pl-12"
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="label">I am a:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('buyer')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      role === 'buyer'
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <ShoppingBag
                      className={`w-6 h-6 mx-auto mb-2 ${
                        role === 'buyer' ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <div className={`font-bold text-sm ${role === 'buyer' ? 'text-emerald-600' : 'text-slate-700'}`}>
                      Buyer
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('agent')}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      role === 'agent'
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <Briefcase
                      className={`w-6 h-6 mx-auto mb-2 ${
                        role === 'agent' ? 'text-emerald-600' : 'text-slate-400'
                      }`}
                    />
                    <div className={`font-bold text-sm ${role === 'agent' ? 'text-emerald-600' : 'text-slate-700'}`}>
                      Agent
                    </div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-800 px-5 py-4 rounded-xl font-semibold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span>Creating Account...</span>
                ) : (
                  <span className="flex items-center justify-center">
                    Create Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center">
              <p className="text-slate-600">
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="text-slate-600 hover:text-slate-900 font-semibold transition-colors">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
