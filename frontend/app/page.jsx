'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { landAPI } from '@/lib/api';
import { Map, Ruler, Shield, CreditCard, TrendingUp, Award, MapPin, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [lands, setLands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLands() {
      try {
        const result = await landAPI.getAll();
        setLands(result.lands || []);
      } catch (error) {
        console.error('Error loading lands:', error);
      } finally {
        setLoading(false);
      }
    }
    loadLands();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[700px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDM2YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="container mx-auto px-6 py-24 relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20 rounded-full px-5 py-2 mb-6">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 font-semibold text-sm">Premium Land Marketplace</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              Discover Your
              <span className="block bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Perfect Land
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              Browse premium agricultural and commercial properties with detailed boundary maps, precise measurements, and verified documentation.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/search" className="btn-primary shadow-2xl shadow-emerald-500/50 inline-flex items-center">
                Start Exploring
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="#featured" className="btn-outline inline-block">
                View Listings
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-12 mt-16 pt-8 border-t border-white/10 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-1">2,500+</div>
                <div className="text-sm text-slate-400">Properties Listed</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-1">98%</div>
                <div className="text-sm text-slate-400">Customer Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-white mb-1">50+</div>
                <div className="text-sm text-slate-400">Districts Covered</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      <section className="py-24 bg-slate-50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Why Choose <span className="text-emerald-600">LandScape</span>
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience the most advanced property search platform with tools designed for precision and transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="feature-card group">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl shadow-emerald-500/30">
                <Map className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Interactive Maps</h3>
              <p className="text-slate-600 leading-relaxed">
                View exact property boundaries with high-precision satellite imagery and interactive map controls.
              </p>
            </div>

            <div className="feature-card group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl shadow-blue-500/30">
                <Ruler className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Precision Tools</h3>
              <p className="text-slate-600 leading-relaxed">
                Measure distances, calculate areas, and search within custom radius using professional-grade tools.
              </p>
            </div>

            <div className="feature-card group">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl shadow-amber-500/30">
                <Shield className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Verified Listings</h3>
              <p className="text-slate-600 leading-relaxed">
                Access thoroughly verified property documents, ownership details, and complete legal information.
              </p>
            </div>

            <div className="feature-card group">
              <div className="bg-gradient-to-br from-violet-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl shadow-violet-500/30">
                <CreditCard className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Flexible Plans</h3>
              <p className="text-slate-600 leading-relaxed">
                Choose monthly subscriptions for full access or pay per property for individual detailed information.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-3">
                Featured Properties
              </h2>
              <p className="text-lg text-slate-600">
                Handpicked premium lands available now
              </p>
            </div>
            <Link
              href="/search"
              className="flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-bold group"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 border-t-emerald-600"></div>
              <p className="mt-6 text-slate-600 font-semibold">Loading premium properties...</p>
            </div>
          ) : lands.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-3xl">
              <MapPin className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 text-lg">No properties available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lands.slice(0, 6).map((land) => (
                <Link key={land.id} href={`/land/${land.id}`} className="card group">
                  <div className="relative h-64 bg-slate-200 overflow-hidden">
                    {land.photos && land.photos[0] ? (
                      <img
                        src={land.photos[0]}
                        alt={land.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                        <Map className="w-16 h-16 text-slate-400" />
                      </div>
                    )}
                    <div className="gradient-overlay"></div>
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-bold text-emerald-600">{land.price_range}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {land.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-slate-600 text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{land.district}</span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div>
                        <div className="text-xs text-slate-500 font-semibold mb-1">AREA</div>
                        <div className="text-sm font-bold text-slate-900">
                          {land.area_guntas} guntas
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-semibold mb-1">SIZE</div>
                        <div className="text-sm font-bold text-slate-900">
                          {land.area_acres} acres
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDM2YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iIzEwYjk4MSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <TrendingUp className="w-16 h-16 text-emerald-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Find Your Ideal Property?
            </h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Join thousands of satisfied customers who found their perfect land through our platform. Start your journey today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="btn-primary shadow-2xl shadow-emerald-500/50">
                Get Started Free
              </Link>
              <Link href="/search" className="btn-outline">
                Browse Properties
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
