'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { landAPI } from '@/lib/api';
import { Map, Ruler, Shield, Users, TrendingUp, Award, MapPin, ArrowRight, Search, Sparkles, CheckCircle, Home, Building2, Trees, Tractor } from 'lucide-react';

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
      <section className="relative min-h-[700px] overflow-hidden bg-gradient-to-br from-[#2F4F32] via-[#1F2F36] to-[#4D3D34] pb-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDM2YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iIzkwQjc3RCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>

        <div className="container mx-auto px-6 pt-24 pb-32 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-[#90B77D]/10 backdrop-blur-sm border border-[#90B77D]/20 rounded-full px-5 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#C6AB62]" />
              <span className="text-[#C6AB62] font-semibold text-sm">Smart Land Listing Platform</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
              Discover Lands.
              <span className="block text-[#C6AB62]">
                Fast, Verified & Easy.
              </span>
            </h1>

            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto">
              BhuDeals is a smart land listing platform that helps buyers explore verified land information, connect with landowners and agents, and access premium digital services for faster decision-making.
            </p>

            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <Link href="/search" className="px-8 py-3.5 bg-[#C6AB62] hover:bg-[#b39952] text-[#111111] font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#C6AB62]/20 hover:-translate-y-0.5 active:scale-95 inline-flex items-center">
                Explore Lands
                <Search className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/admin/add-land" className="px-8 py-3.5 bg-transparent border-2 border-white text-white hover:bg-white/10 backdrop-blur-sm font-semibold rounded-xl transition-all duration-300 active:scale-95 inline-block">
                Post Your Land
              </Link>
            </div>

            <Link href="#submit-requirement" className="inline-flex items-center text-[#90B77D] hover:text-[#C6AB62] transition-colors font-medium">
              Can't Find What You're Looking For?
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </div>

      </section>

      <section className="py-24 bg-[#F4EFE2] relative -mt-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#2F4F32] mb-4">
              What <span className="text-[#C6AB62]">BhuDeals</span> Does
            </h2>
            <p className="text-lg text-[#4D3D34] max-w-2xl mx-auto">
              A smart platform connecting buyers, landowners, and agents through verified listings and premium digital services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-[#90B77D]/20 hover:border-[#C6AB62] group">
              <div className="bg-gradient-to-br from-[#90B77D] to-[#2F4F32] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl shadow-[#90B77D]/30">
                <Search className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2F4F32]">Land Discovery Platform</h3>
              <p className="text-[#4D3D34] leading-relaxed">
                Browse lands across multiple categories with clear, organized information.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-[#90B77D]/20 hover:border-[#C6AB62] group">
              <div className="bg-gradient-to-br from-[#1F2F36] to-[#4D3D34] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl shadow-[#1F2F36]/30">
                <Users className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2F4F32]">Connect Buyers, Owners & Agents</h3>
              <p className="text-[#4D3D34] leading-relaxed">
                We help you discover genuine sellers and verified agents.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-[#90B77D]/20 hover:border-[#C6AB62] group">
              <div className="bg-gradient-to-br from-[#C6AB62] to-[#b39952] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl shadow-[#C6AB62]/30">
                <Map className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2F4F32]">Smart Land Information</h3>
              <p className="text-[#4D3D34] leading-relaxed">
                Maps, approach roads, media, and essential land details — all in one place.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-[#90B77D]/20 hover:border-[#C6AB62] group">
              <div className="bg-gradient-to-br from-[#90B77D] to-[#2F4F32] w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl shadow-[#90B77D]/30">
                <Sparkles className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#2F4F32]">Optional Premium Services</h3>
              <p className="text-[#4D3D34] leading-relaxed">
                Boost listings, highlight lands, unlock premium visibility, or request personalised digital scouting.
              </p>
            </div>
          </div>

          <div className="max-w-3xl mx-auto bg-white border-2 border-[#C6AB62] rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-4">
              <Shield className="w-6 h-6 text-[#C6AB62] flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-[#2F4F32] mb-2">Important</h4>
                <p className="text-[#4D3D34] leading-relaxed">
                  BhuDeals is a listing and discovery platform. All interactions, negotiations, and financial dealings are directly between buyers, landowners, and agents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#2F4F32] mb-4">
              Land Categories
            </h2>
            <p className="text-lg text-[#4D3D34]">
              Explore lands across multiple categories
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            <div className="bg-[#F4EFE2] rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-[#90B77D]/20 hover:border-[#C6AB62]">
              <Tractor className="w-10 h-10 text-[#2F4F32] mx-auto mb-3" />
              <h3 className="font-bold text-[#2F4F32] text-sm">Agricultural Lands</h3>
            </div>
            <div className="bg-[#F4EFE2] rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-[#90B77D]/20 hover:border-[#C6AB62]">
              <Trees className="w-10 h-10 text-[#2F4F32] mx-auto mb-3" />
              <h3 className="font-bold text-[#2F4F32] text-sm">Farm Lands</h3>
            </div>
            <div className="bg-[#F4EFE2] rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-[#90B77D]/20 hover:border-[#C6AB62]">
              <Home className="w-10 h-10 text-[#2F4F32] mx-auto mb-3" />
              <h3 className="font-bold text-[#2F4F32] text-sm">Residential Plots</h3>
            </div>
            <div className="bg-[#F4EFE2] rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-[#90B77D]/20 hover:border-[#C6AB62]">
              <Building2 className="w-10 h-10 text-[#2F4F32] mx-auto mb-3" />
              <h3 className="font-bold text-[#2F4F32] text-sm">Commercial Lands</h3>
            </div>
            <div className="bg-[#F4EFE2] rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 border border-[#90B77D]/20 hover:border-[#C6AB62]">
              <TrendingUp className="w-10 h-10 text-[#2F4F32] mx-auto mb-3" />
              <h3 className="font-bold text-[#2F4F32] text-sm">Investment Lands</h3>
            </div>
          </div>
        </div>
      </section>

      <section id="featured" className="py-24 bg-[#F4EFE2]">
        <div className="container mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-[#2F4F32] mb-3">
                Featured Properties
              </h2>
              <p className="text-lg text-[#4D3D34]">
                Handpicked premium lands available now
              </p>
            </div>
            <Link
              href="/search"
              className="flex items-center space-x-2 text-[#C6AB62] hover:text-[#b39952] font-bold group"
            >
              <span>View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-[#90B77D]/20 border-t-[#C6AB62]"></div>
              <p className="mt-6 text-[#4D3D34] font-semibold">Loading premium properties...</p>
            </div>
          ) : lands.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl">
              <MapPin className="w-16 h-16 text-[#90B77D]/30 mx-auto mb-4" />
              <p className="text-[#4D3D34] text-lg">No properties available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lands.slice(0, 6).map((land) => (
                <Link key={land.id} href={`/land/${land.id}`} className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border border-[#90B77D]/20 group">
                  <div className="relative h-64 bg-[#F4EFE2] overflow-hidden">
                    {land.photos && land.photos[0] ? (
                      <img
                        src={land.photos[0]}
                        alt={land.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#F4EFE2] to-[#90B77D]/10">
                        <Map className="w-16 h-16 text-[#90B77D]/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2F4F32]/90 via-[#2F4F32]/40 to-transparent"></div>
                    <div className="absolute top-4 right-4 bg-[#C6AB62] backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-sm font-bold text-[#111111]">{land.price_range}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-[#2F4F32] group-hover:text-[#C6AB62] transition-colors">
                      {land.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-[#4D3D34] text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{land.district}</span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-[#90B77D]/20">
                      <div>
                        <div className="text-xs text-[#707070] font-semibold mb-1">AREA</div>
                        <div className="text-sm font-bold text-[#2F4F32]">
                          {land.area_guntas} guntas
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#707070] font-semibold mb-1">SIZE</div>
                        <div className="text-sm font-bold text-[#2F4F32]">
                          {land.area_acres} acres
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-[#C6AB62] group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="submit-requirement" className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-16 h-16 text-[#C6AB62] mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black text-[#2F4F32] mb-6">
              Need Something Specific? We'll Help You Find It.
            </h2>
            <p className="text-xl text-[#4D3D34] mb-10 leading-relaxed">
              Share your requirements and our digital team will shortlist the most suitable lands using our verified landowner and agent network.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/search" className="px-8 py-3.5 bg-[#C6AB62] hover:bg-[#b39952] text-[#111111] font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#C6AB62]/20 hover:-translate-y-0.5 active:scale-95">
                Submit Requirement
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-[#2F4F32] via-[#1F2F36] to-[#4D3D34] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxIDAgNiAyLjY5IDYgNnMtMi42OSA2LTYgNi02LTIuNjktNi02IDIuNjktNiA2LTZ6TTI0IDM2YzMuMzEgMCA2IDIuNjkgNiA2cy0yLjY5IDYtNiA2LTYtMi42OS02LTYgMi42OS02IDYtNnoiIHN0cm9rZT0iIzkwQjc3RCIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSIvPjwvZz48L3N2Zz4=')] opacity-10"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-[#C6AB62] mb-3">
                  Does BhuDeals take commission or brokerage?
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  No. BhuDeals does not participate in property transactions. All dealings are strictly between buyers, landowners, and agents.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-[#C6AB62] mb-3">
                  How does BhuDeals earn revenue?
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Through premium listing boosts, agent subscriptions, and digital scouting services.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-[#C6AB62] mb-3">
                  Can I contact sellers directly?
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Yes, all listings include direct contact details.
                </p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-[#C6AB62] mb-3">
                  Are land details verified?
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Basic details are cross-checked for accuracy as shared by owners/agents.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F4EFE2]">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-[#90B77D] mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black text-[#2F4F32] mb-6">
              Ready to Find Your Ideal Land?
            </h2>
            <p className="text-xl text-[#4D3D34] mb-10 leading-relaxed">
              Join thousands who found their perfect land through our platform. Start exploring today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="px-8 py-3.5 bg-[#C6AB62] hover:bg-[#b39952] text-[#111111] font-semibold rounded-xl transition-all duration-300 hover:shadow-xl hover:shadow-[#C6AB62]/20 hover:-translate-y-0.5 active:scale-95">
                Get Started Free
              </Link>
              <Link href="/search" className="px-8 py-3.5 bg-transparent border-2 border-[#2F4F32] text-[#2F4F32] hover:bg-[#2F4F32] hover:text-white font-semibold rounded-xl transition-all duration-300 active:scale-95">
                Browse Lands
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
