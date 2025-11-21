'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { MapPin, LogOut, Search, Home, PlusCircle } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-[#90B77D]/20">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-[#90B77D] to-[#2F4F32] p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-[#90B77D]/30">
              <MapPin className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-[#2F4F32] tracking-tight">BhuDeals</span>
              <span className="text-xs text-[#C6AB62] font-semibold -mt-1">Smart Land Platform</span>
            </div>
          </Link>

          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className="flex items-center space-x-2 text-[#4D3D34] hover:text-[#C6AB62] font-semibold transition-colors duration-200 group"
            >
              <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </Link>
            <Link
              href="/search"
              className="flex items-center space-x-2 text-[#4D3D34] hover:text-[#C6AB62] font-semibold transition-colors duration-200 group"
            >
              <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Explore</span>
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin/add-land"
                    className="flex items-center space-x-2 text-[#4D3D34] hover:text-[#C6AB62] font-semibold transition-colors duration-200 group"
                  >
                    <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Add Land</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-[#2F4F32] text-white hover:bg-[#1F2F36] font-semibold rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[#4D3D34] hover:text-[#C6AB62] font-semibold transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-[#C6AB62] hover:bg-[#b39952] text-[#111111] font-semibold rounded-lg transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
